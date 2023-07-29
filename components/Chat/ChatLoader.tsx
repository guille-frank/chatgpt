import { IconBrandAmongUs } from '@tabler/icons-react';
import { FC } from 'react';

interface Props { }

export const ChatLoader: FC<Props> = () => {
  const randomTexts = [
    'Pensando',
    'Psicoanalizándote',
    'Investigando',
    'Analizando',
    'Resolviendo',
    'Escribiendo',
    'Improvisando',
    'Reflexionando',
    'Interpretando',
    'Decodificando',
    'Observando',
    'Sintetizando',
    'Elaborando',
    'Experimentando',
    'Cuestionando',
    'Sonriendo',
    'Investigando como te podría engañar',
    'Estoy escondiendo algo, espera',
    'Me estoy comiendo un taco, espera',
    'Perame, ando en llamada',
    'Ando viendo memes, esperame',
    'Que perrón tiktok'
  ];
  const randomIndex = Math.floor(Math.random() * randomTexts.length);
  const randomText = randomTexts[randomIndex];

  return (
    <div
      className="group border-b border-black/10 bg-gray-50 text-gray-800 dark:border-gray-900/50 dark:bg-[#444654] dark:text-gray-100"
      style={{ overflowWrap: 'anywhere' }}
    >
      <div className="m-auto flex gap-4 p-4 text-base md:max-w-2xl md:gap-6 md:py-6 lg:max-w-2xl lg:px-0 xl:max-w-3xl">
        <div className="min-w-[40px] items-end">
          <IconBrandAmongUs size={30} />
        </div>
        <span className="cursor-default animate-pulse  mt-1">{randomText}...▍</span>
      </div>
    </div>
  );
};
