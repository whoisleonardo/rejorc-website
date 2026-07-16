const db = require('../db');

const insertLog = db.prepare(
  `INSERT INTO audit_log (user_id, user_name, action, entity, details, ip)
   VALUES (@user_id, @user_name, @action, @entity, @details, @ip)`
);

/**
 * Registra uma acao no log de auditoria.
 * @param {import('express').Request} req
 * @param {{action: string, entity: string, details?: string}} params
 */
function logAction(req, { action, entity, details }) {
  try {
    insertLog.run({
      user_id: req.user ? req.user.id : null,
      user_name: req.user ? req.user.name : 'desconhecido',
      action,
      entity,
      details: details || null,
      ip: req.ip || null,
    });
  } catch (err) {
    // Auditoria nunca deve derrubar a requisicao principal.
    console.error('Falha ao gravar log de auditoria:', err.message);
  }
}

module.exports = { logAction };
