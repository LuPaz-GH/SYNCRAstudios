import { query } from '../config/db.js'
import { RESOURCES } from '../config/resources.js'
import { HttpError } from '../utils/HttpError.js'
import { audit } from './audit.service.js'
import { hashPassword } from './auth.service.js'

// Crear, editar, borrar (borrado lógico) y restaurar cualquier sección del panel.
// Cada cambio queda anotado en el registro de actividad.

export function getResource(name, user) {
  const resource = RESOURCES[name]
  if (!resource) throw new HttpError(404, 'Sección inexistente.')
  if (resource.adminOnly && user.role !== 'admin') throw new HttpError(403, 'Solo el administrador puede hacer esto.')
  return resource
}

// Valida y limpia lo que llega del formulario. Con partial = true, solo los campos enviados.
function clean(resource, body, partial) {
  const data = {}
  for (const [key, field] of Object.entries(resource.fields)) {
    if (!(key in body)) {
      if (!partial && field.required) throw new HttpError(400, `Falta completar "${key}".`)
      continue
    }
    let value = body[key]

    switch (field.type) {
      case 'text':
      case 'long':
        value = String(value ?? '').trim()
        if (field.max && value.length > field.max) throw new HttpError(400, `"${key}" es demasiado largo.`)
        if (field.required && !value) throw new HttpError(400, `Falta completar "${key}".`)
        break
      case 'int':
        value = Number.parseInt(value, 10) || 0
        break
      case 'user':
        value = value === '' || value == null ? null : Number.parseInt(value, 10) || null
        break
      case 'date':
        value = value || null
        if (field.required && !value) throw new HttpError(400, `Falta completar "${key}".`)
        if (value &&!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new HttpError(400, `"${key}" no es una fecha válida.`)
        break
      case 'time':
        value = value ? String(value).slice(0, 5) : null
        if (value && !/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) throw new HttpError(400, `"${key}" no es una hora válida.`)
        break
      case 'enum':
        if (!field.values.includes(value)) throw new HttpError(400, `"${key}" tiene un valor no permitido.`)
        break
      case 'json':
        value = value == null ? null : JSON.stringify(value)
        break
    }
    data[key] = value
  }
  if (resource.table === 'users' && data.email !== undefined) data.email = data.email.toLowerCase()
  return data
}

// Foto de la fila para el registro (sin datos sensibles ni campos internos).
function snapshot(resource, row) {
  const out = { id: row.id }
  for (const key of Object.keys(resource.fields)) out[key] = row[key]
  return out
}

async function findRow(resource, id) {
  const [row] = await query(`SELECT * FROM ${resource.table} WHERE id = ?`, [id])
  if (!row) throw new HttpError(404, `No se encontró el ${resource.label}.`)
  delete row.password_hash // nunca sale del servidor
  return row
}

const titleOf = (resource, row) => row[resource.title] || `#${row.id}`

export async function list(name, user, { trash = false } = {}) {
  const resource = getResource(name, user)
  const where = [trash ? 't.deleted_at IS NOT NULL' : 't.deleted_at IS NULL']
  const params = []
  // En la papelera, cada empleado ve lo que borró; el administrador ve todo.
  if (trash && user.role !== 'admin') {
    where.push('t.deleted_by = ?')
    params.push(user.id)
  }
  const assigned = resource.fields.assigned_to
    ? ', au.name AS assigned_to_name'
    : ''
  const assignedJoin = resource.fields.assigned_to ? 'LEFT JOIN users au ON au.id = t.assigned_to' : ''

  const rows = await query(
    `SELECT t.*, cu.name AS created_by_name, uu.name AS updated_by_name, du.name AS deleted_by_name${assigned}
     FROM ${resource.table} t
     LEFT JOIN users cu ON cu.id = t.created_by
     LEFT JOIN users uu ON uu.id = t.updated_by
     LEFT JOIN users du ON du.id = t.deleted_by
     ${assignedJoin}
     WHERE ${where.join(' AND ')}
     ORDER BY ${trash ? 't.deleted_at DESC' : resource.order}`,
    params,
  )
  for (const row of rows) delete row.password_hash
  return rows
}

export async function create(name, user, body) {
  const resource = getResource(name, user)
  const data = clean(resource, body, false)

  if (resource.table === 'users') {
    const password = String(body.password || '')
    if (password.length < 8) throw new HttpError(400, 'La contraseña tiene que tener al menos 8 caracteres.')
    data.password_hash = await hashPassword(password)
  }
  if (resource.table === 'messages' && data.notes === undefined) data.notes = ''
  if (resource.table === 'tasks' && data.description === undefined) data.description = ''
  if (resource.table === 'bookings' && data.notes === undefined) data.notes = ''

  data.created_by = user.id
  data.updated_by = user.id
  const result = await insert(resource, data)
  const row = await findRow(resource, result.insertId)
  await audit(user.id, 'crear', name, row.id, `Creó ${resource.label} "${titleOf(resource, row)}"`, null, snapshot(resource, row))
  return row
}

async function insert(resource, data) {
  try {
    return await query(`INSERT INTO ${resource.table} SET ?`, [data])
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') throw await duplicateEmail(data.email)
    throw err
  }
}

async function duplicateEmail(email) {
  const [user] = await query('SELECT deleted_at FROM users WHERE email = ?', [email])
  return new HttpError(
    409,
    user?.deleted_at
      ? 'Ese email es de un usuario que está en la papelera. Restauralo desde ahí.'
      : 'Ya existe un usuario con ese email.',
  )
}

export async function update(name, user, id, body, action = 'editar') {
  const resource = getResource(name, user)
  const before = await findRow(resource, id)
  if (before.deleted_at) throw new HttpError(409, `El ${resource.label} está en la papelera. Restauralo primero.`)

  const data = clean(resource, body, true)
  if (resource.table === 'users') {
    if (Number(id) === user.id && data.role && data.role !== user.role) {
      throw new HttpError(400, 'No podés cambiar tu propio rol.')
    }
    if (body.password) {
      if (String(body.password).length < 8) {
        throw new HttpError(400, 'La contraseña tiene que tener al menos 8 caracteres.')
      }
      data.password_hash = await hashPassword(String(body.password))
    }
  }

  // Solo registramos lo que cambió de verdad.
  const prev = snapshot(resource, before)
  const changedBefore = {}
  const changedAfter = {}
  for (const [key, value] of Object.entries(data)) {
    if (key === 'password_hash') continue
    const type = resource.fields[key].type
    let old = prev[key]
    if (type === 'json') old = JSON.stringify(old ?? null)
    if (type === 'time' && old) old = old.slice(0, 5) // la base guarda "10:00:00"; el formulario manda "10:00"
    if (String(old ?? '') !== String(value ?? '')) {
      changedBefore[key] = prev[key]
      changedAfter[key] = resource.fields[key].type === 'json' ? JSON.parse(value) : value
    }
  }
  const passwordChanged = Boolean(data.password_hash)
  if (!Object.keys(changedAfter).length && !passwordChanged) return before

  data.updated_by = user.id
  try {
    await query(`UPDATE ${resource.table} SET ? WHERE id = ?`, [data, id])
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') throw await duplicateEmail(data.email)
    throw err
  }

  const fields = Object.keys(changedAfter)
  if (passwordChanged) fields.push('contraseña')
  const verb = action === 'deshacer' ? 'Deshizo un cambio en' : 'Editó'
  await audit(
    user.id,
    action,
    name,
    Number(id),
    `${verb} ${resource.label} "${titleOf(resource, before)}" (${fields.join(', ')})`,
    changedBefore,
    changedAfter,
  )
  return findRow(resource, id)
}

export async function remove(name, user, id) {
  const resource = getResource(name, user)
  const row = await findRow(resource, id)
  if (row.deleted_at) throw new HttpError(409, `El ${resource.label} ya está en la papelera.`)
  if (resource.table === 'users' && Number(id) === user.id) throw new HttpError(400, 'No podés borrarte a vos misma/o.')

  await query(`UPDATE ${resource.table} SET deleted_at = UTC_TIMESTAMP(), deleted_by = ? WHERE id = ?`, [user.id, id])
  await audit(user.id, 'borrar', name, Number(id), `Mandó a la papelera ${resource.label} "${titleOf(resource, row)}"`, snapshot(resource, row))
}

export async function restore(name, user, id) {
  const resource = getResource(name, user)
  const row = await findRow(resource, id)
  if (!row.deleted_at) throw new HttpError(409, `El ${resource.label} no está en la papelera.`)
  if (user.role !== 'admin' && row.deleted_by !== user.id) {
    throw new HttpError(403, 'Solo podés restaurar lo que borraste vos. Pedíselo al administrador.')
  }

  await query(`UPDATE ${resource.table} SET deleted_at = NULL, deleted_by = NULL, updated_by = ? WHERE id = ?`, [user.id, id])
  await audit(user.id, 'restaurar', name, Number(id), `Restauró ${resource.label} "${titleOf(resource, row)}"`, null, snapshot(resource, row))
}

// Deshace una edición del registro: vuelve los campos a como estaban antes.
export async function undo(user, logId) {
  const [entry] = await query('SELECT * FROM audit_log WHERE id = ?', [logId])
  if (!entry) throw new HttpError(404, 'No se encontró ese movimiento.')
  if (entry.action === 'borrar') return restore(entry.entity, user, entry.entity_id)
  if (entry.action !== 'editar' && entry.action !== 'deshacer') {
    throw new HttpError(400, 'Este movimiento no se puede deshacer.')
  }
  const resource = getResource(entry.entity, user)
  const body = {}
  for (const [key, value] of Object.entries(entry.before_data || {})) {
    if (resource.fields[key]) body[key] = value
  }
  if (!Object.keys(body).length) throw new HttpError(400, 'Este movimiento no tiene nada para deshacer.')
  return update(entry.entity, user, entry.entity_id, body, 'deshacer')
}
