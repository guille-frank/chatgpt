import { Conversation } from '@/types/chat';
import {
  ExportFormatV1,
  ExportFormatV2,
  ExportFormatV3,
  ExportFormatV4,
  LatestExportFormat,
  SupportedExportFormats,
} from '@/types/export';
import { FolderInterface } from '@/types/folder';
import { Prompt } from '@/types/prompt';
import { getCookieValue } from '@/utils/app/sessions';
import { toast } from 'react-toastify';

import { cleanConversationHistory } from './clean';
import { Cookie } from 'next/font/google';

export function isExportFormatV1(obj: any): obj is ExportFormatV1 {
  return Array.isArray(obj);
}

export function isExportFormatV2(obj: any): obj is ExportFormatV2 {
  if (obj != null && obj.version != null && 'folders' in obj && 'history' in obj) {
    if (obj.version === 2) {
      return true;
    }
  }
  return false;
}

export function isExportFormatV3(obj: any): obj is ExportFormatV3 {
  return obj.version === 3;
}

export function isExportFormatV4(obj: any): obj is ExportFormatV4 {
  return obj.version === 4;
}

export const isLatestExportFormat = isExportFormatV4;

export function cleanData(data: SupportedExportFormats): LatestExportFormat {
  if (isExportFormatV1(data)) {
    return {
      version: 4,
      history: cleanConversationHistory(data),
      folders: [],
      prompts: [],
    };
  }

  if (isExportFormatV2(data)) {
    return {
      version: 4,
      history: cleanConversationHistory(data.history || []),
      folders: (data.folders || []).map((chatFolder) => ({
        id: chatFolder.id.toString(),
        name: chatFolder.name,
        type: 'chat',
      })),
      prompts: [],
    };
  }

  if (isExportFormatV3(data)) {
    return { ...data, version: 4, prompts: [] };
  }

  if (isExportFormatV4(data)) {
    return data;
  }

  throw new Error('Unsupported data format');
}

function currentDate() {
  const date = new Date();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}-${day}`;
}

export const exportData = async () => {
  let history = localStorage.getItem('conversationHistory');
  let folders = localStorage.getItem('folders');
  let prompts = localStorage.getItem('prompts');

  if (history) {
    history = JSON.parse(history);
  }

  if (folders) {
    folders = JSON.parse(folders);
  }

  if (prompts) {
    prompts = JSON.parse(prompts);
  }

  /*const data = {
    version: 4,
    history: history || [],
    folders: folders || [],
    prompts: prompts || [],
  } as LatestExportFormat;

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `chatbot_ui_history_${currentDate()}.json`;
  link.href = url;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  */
  const data = {
    version: 4,
    history: history || [],
    folders: folders || [],
    prompts: prompts || [],
  } as LatestExportFormat;

  // Convertir el objeto a una cadena JSON
  const jsonData = Buffer.from(JSON.stringify(data)).toString('base64');

  // Obtener la cookie de autenticación (reemplaza 'wp-gstools_login' con el nombre de tu cookie)
  const authCookie = getCookieValue('wp-gstools_login');

  // Verificar si existe la cookie de autenticación
  if (!authCookie) {
    toast.error('No se encontro tu cookie de autenticación.', {
      position: 'top-center', // Posición de la notificación en la pantalla
      autoClose: 3000, // Tiempo en milisegundos que la notificación se mostrará antes de cerrarse automáticamente
      hideProgressBar: true, // Mostrar barra de progreso
      closeOnClick: true, // Cerrar la notificación al hacer clic en ella
      pauseOnHover: true, // Pausar el tiempo de cierre al pasar el cursor sobre la notificación
      draggable: true, // Permitir arrastrar la notificación
      progress: undefined, // Componente personalizado para la barra de progreso
    });
    console.error('Error: No se encontró la cookie de autenticación');
    window.location.reload();
    // ... Código adicional para manejar el caso en el que la cookie no existe ...
    return;
  }
  console.log (authCookie);
  const dataPOST = {
    cookie: authCookie,
    json: jsonData,
  };

  try {

    const response = await fetch('https://backoffice.guidevstudios.com/wp-gstools/wp-json/gs/v1/save_json', {
      method: 'POST',
      headers: {
        'User-Agent': navigator.userAgent,
        'Accept': "application/json",
        'DNT': "1",
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataPOST),
    });
    //const responseData = await response.json();
    const responseText = await response.text();
    // Verificar la respuesta del servidor
    if (response.ok) {
      console.log('Exportación exitosa');
      toast.success('¡Ya se subieron tus chats!', {
        position: 'top-center', // Posición de la notificación en la pantalla
        autoClose: 3000, // Tiempo en milisegundos que la notificación se mostrará antes de cerrarse automáticamente
        hideProgressBar: true, // Mostrar barra de progreso
        closeOnClick: true, // Cerrar la notificación al hacer clic en ella
        pauseOnHover: true, // Pausar el tiempo de cierre al pasar el cursor sobre la notificación
        draggable: true, // Permitir arrastrar la notificación
        progress: undefined, // Componente personalizado para la barra de progreso
      });
      console.log("Response: " + responseText);
      // ... Código adicional para manejar la respuesta exitosa ...
    } else {
      toast.error('Hubo un error al authenticar', {
        position: 'top-center', // Posición de la notificación en la pantalla
        autoClose: 3000, // Tiempo en milisegundos que la notificación se mostrará antes de cerrarse automáticamente
        hideProgressBar: true, // Mostrar barra de progreso
        closeOnClick: true, // Cerrar la notificación al hacer clic en ella
        pauseOnHover: true, // Pausar el tiempo de cierre al pasar el cursor sobre la notificación
        draggable: true, // Permitir arrastrar la notificación
        progress: undefined, // Componente personalizado para la barra de progreso
      });
      console.error('Error: No se pudo autenticar');
      console.error("Response: " + responseText);
      window.location.reload();
      // ... Código adicional para manejar el error de autenticación ...
    }
  } catch (error) {
    toast.error('Error general', {
      position: 'top-center', // Posición de la notificación en la pantalla
      autoClose: 3000, // Tiempo en milisegundos que la notificación se mostrará antes de cerrarse automáticamente
      hideProgressBar: true, // Mostrar barra de progreso
      closeOnClick: true, // Cerrar la notificación al hacer clic en ella
      pauseOnHover: true, // Pausar el tiempo de cierre al pasar el cursor sobre la notificación
      draggable: true, // Permitir arrastrar la notificación
      progress: undefined, // Componente personalizado para la barra de progreso
    });
    console.error('Error:', error);
    // ... Código adicional para manejar otros errores ...
  }
};

export const importData = (
  data: SupportedExportFormats,
): LatestExportFormat => {
  const { history, folders, prompts } = cleanData(data);

  const oldConversations = localStorage.getItem('conversationHistory');
  const oldConversationsParsed = oldConversations
    ? JSON.parse(oldConversations)
    : [];

  const newHistory: Conversation[] = [
    ...oldConversationsParsed,
    ...history,
  ].filter(
    (conversation, index, self) =>
      index === self.findIndex((c) => c.id === conversation.id),
  );
  localStorage.setItem('conversationHistory', JSON.stringify(newHistory));
  if (newHistory.length > 0) {
    localStorage.setItem(
      'selectedConversation',
      JSON.stringify(newHistory[newHistory.length - 1]),
    );
  } else {
    localStorage.removeItem('selectedConversation');
  }

  const oldFolders = localStorage.getItem('folders');
  const oldFoldersParsed = oldFolders ? JSON.parse(oldFolders) : [];
  const newFolders: FolderInterface[] = [
    ...oldFoldersParsed,
    ...folders,
  ].filter(
    (folder, index, self) =>
      index === self.findIndex((f) => f.id === folder.id),
  );
  localStorage.setItem('folders', JSON.stringify(newFolders));

  const oldPrompts = localStorage.getItem('prompts');
  const oldPromptsParsed = oldPrompts ? JSON.parse(oldPrompts) : [];
  const newPrompts: Prompt[] = [...oldPromptsParsed, ...prompts].filter(
    (prompt, index, self) =>
      index === self.findIndex((p) => p.id === prompt.id),
  );
  localStorage.setItem('prompts', JSON.stringify(newPrompts));

  return {
    version: 4,
    history: newHistory,
    folders: newFolders,
    prompts: newPrompts,
  };
};
