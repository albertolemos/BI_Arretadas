import api from '../api/index'

/**
 * Autentica o usuário
 * 
 * @param {String} oldTtoken {oldToken: String}
 * @returns {Promise}
 */
export async function validateToken(token) {
  return await api.post("/user/valid-token", token)
}
