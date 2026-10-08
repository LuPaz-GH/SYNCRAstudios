-- Base de datos del panel de SYNCRA.
-- Todas las tablas usan borrado lógico: "deleted_at" con fecha = está en la papelera.
-- Nada se borra de verdad, así siempre se puede restaurar.

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(100) NOT NULL,
  role ENUM('admin', 'empleado') NOT NULL DEFAULT 'empleado',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT UNSIGNED NULL,
  updated_by INT UNSIGNED NULL,
  deleted_at DATETIME NULL,
  deleted_by INT UNSIGNED NULL
);

CREATE TABLE IF NOT EXISTS events (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  kind VARCHAR(80) NOT NULL DEFAULT '',
  date VARCHAR(80) NOT NULL DEFAULT '',
  place VARCHAR(160) NOT NULL DEFAULT '',
  text TEXT NOT NULL,
  videos JSON NULL,
  position INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT UNSIGNED NULL,
  updated_by INT UNSIGNED NULL,
  deleted_at DATETIME NULL,
  deleted_by INT UNSIGNED NULL
);

CREATE TABLE IF NOT EXISTS messages (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  org VARCHAR(160) NOT NULL DEFAULT '',
  service VARCHAR(160) NOT NULL DEFAULT '',
  message TEXT NOT NULL,
  status ENUM('nuevo', 'en_curso', 'respondido') NOT NULL DEFAULT 'nuevo',
  notes TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT UNSIGNED NULL,
  updated_by INT UNSIGNED NULL,
  deleted_at DATETIME NULL,
  deleted_by INT UNSIGNED NULL
);

CREATE TABLE IF NOT EXISTS tasks (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  status ENUM('pendiente', 'en_curso', 'hecha') NOT NULL DEFAULT 'pendiente',
  due_date DATE NULL,
  assigned_to INT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT UNSIGNED NULL,
  updated_by INT UNSIGNED NULL,
  deleted_at DATETIME NULL,
  deleted_by INT UNSIGNED NULL
);

-- Registro de todo lo que se hace en el panel: quién, qué, cuándo y cómo estaba antes/después.
CREATE TABLE IF NOT EXISTS audit_log (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NULL,
  action ENUM('crear', 'editar', 'borrar', 'restaurar', 'deshacer', 'login') NOT NULL,
  entity VARCHAR(40) NOT NULL,
  entity_id INT UNSIGNED NULL,
  summary VARCHAR(255) NOT NULL DEFAULT '',
  before_data JSON NULL,
  after_data JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX (user_id),
  INDEX (entity, entity_id),
  INDEX (created_at)
);
