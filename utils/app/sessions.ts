// sessionUtils.js
import axios from 'axios';
import { toast } from 'react-toastify';

// Función para verificar la sesión del usuario
export const verifySession = async (first: boolean) => {
  // Obtener el valor de la cookie "wp-gstools_login"
  const cookieValue = getCookieValue('wp-gstools_login');

  if (!cookieValue) {
    if (first) {
      toast.info('¡Inicia sesión primero!', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    // Si la cookie no existe, retornar false
    return false;
  } else {
    try {
      const headers = {
        'User-Agent': navigator.userAgent,
        'Accept': "application/json",
        'DNT': "1",
      };
      // Hacer una solicitud al servidor para verificar la cookie
      const response = await axios.get(
        `https://backoffice.guidevstudios.com/wp-gstools/wp-json/gs/v1/check_cookie/${cookieValue}`
      );

      // Comprobar si el servidor retorna un array con "exists": true
      if (response.data.exists) {
        return true;
      } else {
        toast.info('Parece que tu sesión se caducó.', {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return false;
      }
    } catch (error) {
      // Si hay algún error en la solicitud al servidor, retornar false
      console.error('Error al verificar la cookie:', error);
      toast.error('Parece que no hay conexión con el servidor...\nReintentando...', {
        position: 'top-center',
        autoClose: 8000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return null;
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
