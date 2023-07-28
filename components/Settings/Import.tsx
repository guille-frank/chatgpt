import { IconDownload } from '@tabler/icons-react';
import { FC, useState } from 'react';
import axios from 'axios'; // Importa la librería axios

import { useTranslation } from 'next-i18next';

import { SupportedExportFormats } from '@/types/export';

import { SidebarButton } from '../Sidebar/SidebarButton';
import { getCookieValue } from '@/utils/app/sessions';
import { toast } from 'react-toastify';

interface Props {
  onImport: (data: SupportedExportFormats) => void;
}

export const Import: FC<Props> = ({ onImport }) => {
  const { t } = useTranslation('sidebar');
  const [isLoading, setIsLoading] = useState(false);

  const handleImportClick = async () => {
    if (isLoading) return; // Si ya se está cargando el archivo, no hacer nada

    setIsLoading(true);
    const cookie = getCookieValue('wp-gstools_login');

    try {
      // Hacer la solicitud HTTP a la URL para obtener el archivo JSON
      console.log("https://backoffice.guidevstudios.com/wp-gstools/wp-json/gs/v1/get_json/${cookie}");
      const response = await axios.get(`https://backoffice.guidevstudios.com/wp-gstools/wp-json/gs/v1/get_json/${cookie}`);
      console.log("downloading...")
      // Verificar que la solicitud fue exitosa y que el JSON fue recibido
      if (response.status === 200 && response.data) {
        console.log(response.data);
        toast.success('¡Se obtuvieron tus chats!', {
          position: 'top-center', // Posición de la notificación en la pantalla
          autoClose: 3000, // Tiempo en milisegundos que la notificación se mostrará antes de cerrarse automáticamente
          hideProgressBar: true, // Mostrar barra de progreso
          closeOnClick: true, // Cerrar la notificación al hacer clic en ella
          pauseOnHover: true, // Pausar el tiempo de cierre al pasar el cursor sobre la notificación
          draggable: true, // Permitir arrastrar la notificación
          progress: undefined, // Componente personalizado para la barra de progreso
        });
        onImport(response.data); // Llamar a la función onImport con el JSON recibido como argumento
      }
    } catch (error) {
      console.error('Error al importar el JSON:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SidebarButton
        text={t('Download My Chats')}
        icon={<IconDownload size={18} />}
        onClick={handleImportClick}
        disabled={isLoading}
      />
    </>
  );
};
