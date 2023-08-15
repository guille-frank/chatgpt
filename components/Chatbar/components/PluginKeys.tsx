import { IconKey } from '@tabler/icons-react';
import { KeyboardEvent, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PluginID, PluginKey } from '@/types/plugin';

import HomeContext from '@/pages/api/home/home.context';

import { SidebarButton } from '@/components/Sidebar/SidebarButton';

import ChatbarContext from '../Chatbar.context';

export const PluginKeys = () => {
  const { t } = useTranslation('sidebar');

  const {
    state: { pluginKeys },
  } = useContext(HomeContext);

  const { handlePluginKeyChange, handleClearPluginKey } =
    useContext(ChatbarContext);

  const [isChanging, setIsChanging] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  const handleEnter = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      setIsChanging(false);
    }
  };

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        window.addEventListener('mouseup', handleMouseUp);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      window.removeEventListener('mouseup', handleMouseUp);
      setIsChanging(false);
    };

    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return (<span>NothingHere</span>);
};
