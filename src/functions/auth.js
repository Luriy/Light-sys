/**
 *
 * @param {Boolean} isPassword Подстановка хэша пароля заместо хэша токена
 */
import qs from 'querystring';

export function getAuthParams(isPassword) {
  const userData = qs.parse(localStorage.getItem('Data'));
  const authData = JSON.parse(localStorage.getItem('Auth'));
  if (!authData.email) {
    const {Email, Phone} = userData;
    return {
      Email,
      Phone,
      Password: authData.token
    }
  } else {
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

}
