import { OPENAI_API_TYPE } from '../utils/app/const';

export interface OpenAIModel {
  id: string;
  name: string;
  maxLength: number; // maximum length of a message
  tokenLimit: number;
  tokenLimitMargin: number;
  maxMessages: number;
}

export enum OpenAIModelID {
  GPT_4_turbo = 'gpt-4-turbo-preview',
  GPT_4O = 'gpt-4o',
  GPT_5_THINKING = 'gpt-5-thinking',
  GPT_5_INSTANT = 'gpt-5-instant',
  GPT_5 = 'gpt-5',
}

// en caso de que `DEFAULT_MODEL` no esté definido o sea inválido
export const fallbackModelID = OpenAIModelID.GPT_4_turbo;

export const OpenAIModels: Record<OpenAIModelID, OpenAIModel> = {
  [OpenAIModelID.GPT_4_turbo]: {
    id: OpenAIModelID.GPT_4_turbo,
    name: 'GPT-4-Turbo',
    maxLength: 75000,
    tokenLimit: 128000,
    tokenLimitMargin: 1600,
    maxMessages: 20,
  },
  [OpenAIModelID.GPT_4O]: {
    id: OpenAIModelID.GPT_4O,
    name: 'GPT-4o',
    maxLength: 15100,
    tokenLimit: 128000,
    tokenLimitMargin: 3000,
    maxMessages: 20,
  },
  [OpenAIModelID.GPT_5_THINKING]: {
    id: OpenAIModelID.GPT_5_THINKING,
    name: 'GPT-5-Thinking',
    maxLength: 15100,
    tokenLimit: 128000,
    tokenLimitMargin: 3000,
    maxMessages: 20,
  },
  [OpenAIModelID.GPT_5_INSTANT]: {
    id: OpenAIModelID.GPT_5_INSTANT,
    name: 'GPT-5-Instant',
    maxLength: 15100,
    tokenLimit: 128000,
    tokenLimitMargin: 3000,
    maxMessages: 20,
  },
  [OpenAIModelID.GPT_5]: {
    id: OpenAIModelID.GPT_5,
    name: 'GPT-5',
    maxLength: 15100,
    tokenLimit: 128000,
    tokenLimitMargin: 3000,
    maxMessages: 20,
  },
};

