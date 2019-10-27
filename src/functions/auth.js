/**
 *
 * @param {Boolean} isPassword Подстановка хэша пароля заместо хэша токена
 */
export function getAuthParams(isPassword) {
  const authData = JSON.parse(localStorage.getItem('Auth'));

  return isPassword
    ? {
      Email: authData.email,
      Phone: authData.phone,
      Password: authData.password
    } : {
      Email: authData.email,
      Phone: authData.phone,
      Password: authData.token
    }
}
