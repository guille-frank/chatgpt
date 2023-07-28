// sessionUtils.js
import axios from 'axios';

// Función para verificar la sesión del usuario
export const verifySession = async () => {
  // Obtener el valor de la cookie "wp-gstools_login"
  const cookieValue = getCookieValue('wp-gstools_login');

  if (!cookieValue) {
    // Si la cookie no existe, retornar false
    return false;
  } else {
    try {
      // Hacer una solicitud al servidor para verificar la cookie
      const response = await axios.get(
        `https://backoffice.guidevstudios.com/wp-gstools/wp-json/gs/v1/check_cookie/${cookieValue}`
      );

      // Comprobar si el servidor retorna un array con "exists": true
      if (response.data.exists) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      // Si hay algún error en la solicitud al servidor, retornar false
      console.error('Error al verificar la cookie:', error);
      return false;
    }
  }
};

// Función para obtener el valor de una cookie por su nombre
export const getCookieValue = (name: string) => {
  const cookies = document.cookie.split('; ');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].split('=');
    if (cookie[0] === name) {
      return cookie[1];
    }
  }
  return '';
};
