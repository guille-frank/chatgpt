import { Dispatch, createContext } from 'react';

import { ActionType } from '@/hooks/useCreateReducer';

import { Conversation } from '@/types/chat';
import { SupportedExportFormats } from '@/types/export';
import { PluginKey } from '@/types/plugin';

import { ChatbarInitialState } from './Chatbar.state';

export interface ChatbarContextProps {
  state: ChatbarInitialState;
  dispatch: Dispatch<ActionType<ChatbarInitialState>>;
  handleDeleteConversation: (conversation: Conversation) => void;
  handleClearConversations: () => void;
  setButtonUploadDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  isButtonUploadDisabled: boolean;
  handleExportData: () => Promise<void>;
  handleImportConversations: (data: SupportedExportFormats) => void;
  handlePluginKeyChange: (pluginKey: PluginKey) => void;
  handleClearPluginKey: (pluginKey: PluginKey) => void;
  handleApiKeyChange: (apiKey: string) => void;
}

const ChatbarContext = createContext<ChatbarContextProps>({
  state: undefined!,
  dispatch: undefined!,
  handleDeleteConversation: undefined!,
  handleClearConversations: undefined!,
  setButtonUploadDisabled: () => {},
  isButtonUploadDisabled: false, // Establece isButtonUploadDisabled en 'false'
  handleExportData: () => undefined!,
  handleImportConversations: undefined!,
  handlePluginKeyChange: undefined!,
  handleClearPluginKey: undefined!,
  handleApiKeyChange: undefined!,
});

export default ChatbarContext;
