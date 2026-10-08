<div align="center">

# 🎬 SYNCRA Studios

### ✨ Subtitulados inclusivos y accesibilidad universal ✨

*Transmitimos la esencia humana en cada mensaje.*
*Conectamos personas, palabra por palabra.* 💬

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-puro-f5b800?style=for-the-badge&logo=css3&logoColor=black)
![Accesible](https://img.shields.io/badge/♿_Accesible-100%25-0e0e0e?style=for-the-badge)

🌸 Un servicio de **Mujeres en Red** · 📍 Tucumán, Argentina 🇦🇷

</div>

---

## 💛 ¿Qué es SYNCRA?

Mientras la IA procesa datos de manera literal, en **SYNCRA** capturamos el **contexto**, la **intención** y la **verdadera esencia** del lenguaje humano. 🧠✍️

Contamos con un equipo de **estenotipistas profesionales** que garantizan fidelidad, inmediatez y adaptabilidad cultural en cada intervención. 👩‍💻

---

## 🚀 Servicios

| | Servicio | Descripción |
|:-:|---|---|
| 🎤 | **Subtitulado en vivo** | Eventos presenciales, congresos, webinars y streaming híbrido |
| 📺 | **Transmisiones digitales** | Optimizadas para canales oficiales de YouTube |
| 🎞️ | **Posproducción** | Películas, series, documentales, animación y docurealities |
| 🏢 | **Videos corporativos** | Institucionales, publicitarios, cursos y e-learning |
| 📚 | **Glosarios a medida** | Médica ⚕️ · Legal ⚖️ · Financiera 💰 · Tecnológica 💻 |

---

## 🌍 Compromiso global

| ODS | Objetivo | Nuestro aporte |
|:-:|---|---|
| 5️⃣ | **Igualdad de género** 👩 | Empleo de calidad para mujeres especialistas del sector tecnológico-lingüístico |
| 🔟 | **Reducción de las desigualdades** 🤝 | Accesibilidad universal en entornos corporativos y educativos |

---

## 🎨 La página

- 🖊️ **Logo animado** que se dibuja solo
- 📡 **Pantalla "EN VIVO"** con subtítulos que se escriben en tiempo real
- 🎚️ **Barras tipo ecualizador** inspiradas en el folleto
- 💡 **Texto que se ilumina** palabra por palabra al hacer scroll
- 🃏 **Tarjetas 3D** que siguen al mouse
- 🎥 **Videos de eventos** que se pueden agrandar, pausar y silenciar
- 📲 **Formulario que envía el mensaje por WhatsApp** (y lo guarda en el panel)
- 📱 **100% responsive**: se ve bien en celular, tablet y compu

---

## ♿ Accesibilidad primero

Porque somos una empresa de accesibilidad, la página también lo es 💪

- 🐢 Respeta la opción **"reducir movimiento"** del sistema
- ⌨️ Se puede navegar **solo con teclado**
- 🔊 Compatible con **lectores de pantalla**
- ⏸️ Todos los videos se pueden **pausar y silenciar**

---

## 🛠️ Cómo usarla en tu compu

> 📦 Necesitás tener instalado [Node.js](https://nodejs.org/)

```bash
# 1️⃣ Clonar el repositorio
git clone https://github.com/LuPaz-GH/SYNCRAstudios.git
cd SYNCRAstudios

# 2️⃣ Instalar dependencias
npm install

# 3️⃣ Levantar la página
npm run dev
```

🌐 Abrí **http://localhost:5173** y listo 🎉

| Comando | ¿Qué hace? |
|---|---|
| `npm run dev` | 🔥 Levanta la página para trabajar |
| `npm run build` | 📦 Genera la versión final en `dist/` |
| `npm run preview` | 👀 Muestra la versión final antes de publicarla |
| `npm run api` | 🔐 Levanta solo la API del panel (opcional: `npm run dev` ya la incluye) |
| `npm run db:setup` | 🐬 Crea la base de datos y el administrador |

---

## 📁 Estructura

```
📂 SYNCRA
├── 📂 frontend               → 🎨 todo lo que se ve (web + panel)
│   ├── 📂 public
│   │   └── 🎥 videos/        → videos de eventos
│   ├── 📂 src
│   │   ├── 📂 assets/
│   │   │   ├── data/events.js   → eventos de respaldo
│   │   │   └── styles/panel.css → estilos del panel
│   │   ├── 📂 components/
│   │   │   ├── common/       → piezas reutilizables: ícono, logo, animaciones
│   │   │   ├── layout/       → menú y pie de página
│   │   │   ├── home/         → cada sección de la web
│   │   │   └── panel/        → piezas del panel (formulario, actividad)
│   │   ├── 📂 hooks/         → animaciones de scroll y mouse
│   │   ├── 📂 pages/         → HomePage y panel/ (login, inicio, secciones, actividad)
│   │   ├── 📂 routes/        → AppRouter: web o panel según la dirección
│   │   ├── 📂 services/      → pedidos a la API
│   │   ├── 📂 utils/         → fechas y configuración del panel
│   │   ├── ⚛️ App.jsx
│   │   ├── 🎨 App.css        → estilos de la web
│   │   ├── 🎨 index.css      → colores y estilos base
│   │   └── main.jsx
│   ├── index.html
│   └── vite.config.js
├── 📂 backend                → ⚙️ la API y la base de datos
│   ├── 📂 config/            → conexión a MySQL y secciones del panel
│   ├── 📂 routes/            → direcciones de la API (/api/...)
│   ├── 📂 controllers/       → reciben cada pedido y responden
│   ├── 📂 services/          → la lógica: crear, editar, borrar, restaurar, actividad
│   ├── 📂 middleware/        → sesión, permisos de admin, anti-spam, errores
│   ├── 📂 utils/             → funciones de ayuda
│   ├── 📂 sql/schema.sql     → tablas de la base
│   ├── 📂 scripts/setup.js   → npm run db:setup
│   ├── 📂 functions/api.js   → la API publicada en Netlify
│   ├── app.js                → arma la API
│   └── index.js              → npm run api
├── .env                      → 🔑 contraseñas (no se sube a GitHub)
├── netlify.toml
└── package.json
```

---

## ➕ Agregar un evento

> 💡 Con el panel funcionando, los eventos se cargan desde **/panel/eventos**. Lo de abajo sirve como respaldo si la base no responde.

1. 🎥 Guardá el video en `frontend/public/videos/` (sin espacios en el nombre)
2. ✏️ Abrí `frontend/src/assets/data/events.js` y sumá un bloque:

```js
{
  name: 'Nombre del evento',
  kind: 'Congreso',
  date: 'Mayo 2026',
  place: 'San Miguel de Tucumán',
  videos: [{ src: '/videos/mi-evento.mp4', label: 'Presentación' }],
  text: 'Qué hicimos en el evento.',
},
```

3. 💾 Guardá y ¡aparece solo en la página! ✨

---

## 🔐 Panel interno (admin y empleados)

Un panel privado en **/panel** para gestionar mensajes, eventos, tareas y usuarios.

| | Administrador | Empleado |
|---|:-:|:-:|
| Crear, editar y borrar mensajes, eventos y tareas | ✅ | ✅ |
| Restaurar lo que borró | ✅ | ✅ |
| Restaurar lo que borró **cualquier persona** | ✅ | ❌ |
| Ver la actividad de **todo el equipo** y deshacer cambios | ✅ | ❌ (ve solo la suya) |
| Gestionar usuarios | ✅ | ❌ |

🗑️ **Nada se borra de verdad** (borrado lógico): todo va a la papelera y se puede restaurar.
📝 Cada cambio queda registrado: quién, qué, cuándo y cómo estaba antes.

### Ponerlo en marcha en tu compu

> 🐬 Necesitás MySQL 8 (el que usás con MySQL Workbench sirve).

1. Copiá `.env.example` como `.env` y completá los datos de MySQL y una `JWT_SECRET` larga.
2. Creá la base, las tablas y tu cuenta de administrador:
   ```bash
   npm run db:setup
   ```
3. Levantá todo con `npm run dev` (la web y la API del panel juntas)
4. Entrá a **http://localhost:5173/panel** 🎉

### Publicarlo en Netlify

Netlify no trae MySQL: necesitás una base MySQL en la nube (Aiven, Railway, Clever Cloud, etc.).
En Netlify → *Site configuration → Environment variables*, cargá las mismas variables del `.env`
(`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_SSL`, `JWT_SECRET`).
Corré `npm run db:setup` una vez apuntando a esa base.

---

## 🎨 Paleta de colores

| | Color | Código |
|:-:|---|---|
| ⬛ | Negro | `#0e0e0e` |
| 🩶 | Gris | `#1a1a1a` |
| 🟨 | Amarillo | `#f5b800` |

---

<div align="center">

## 📬 Contacto

📞 **+54 9 381 448-0873** · 🌐 **www.syncra.com** · 📸 **@syncra**

---

Hecho con 💛 para **SYNCRA Studios**

*Accesibilidad que conecta* 🤝

</div>
