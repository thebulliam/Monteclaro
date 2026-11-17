export const ROLES = {
  admin: { nombre: 'Soporte técnico (administración)' },
  gestion: { nombre: 'Gestión de pedidos' },
  consulta: { nombre: 'Solo consulta' },
};

const PERMISOS = {
  admin: ['leer', 'escribir', 'usuarios', 'soporte'],
  gestion: ['leer', 'escribir'],
  consulta: ['leer'],
};

export const puede = (rol, permiso) => (PERMISOS[rol] || []).includes(permiso);

export const nombreRol = (rol) => (ROLES[rol] ? ROLES[rol].nombre : rol);
