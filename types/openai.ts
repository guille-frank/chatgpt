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
  GPT_3_5 = 'gpt-3.5-turbo',
  GPT_3_5_AZ = 'gpt-35-turbo',
  GPT_4 = 'gpt-4',
  GPT_4_turbo = 'gpt-4-turbo-preview',
  GPT_3_5_16K = 'gpt-3.5-turbo-16k',
  GPT_4O = 'gpt-4o',
}
//uwu

// in case the `DEFAULT_MODEL` environment variable is not set or set to an unsupported model
export const fallbackModelID = OpenAIModelID.GPT_3_5;

export const OpenAIModels: Record<OpenAIModelID, OpenAIModel> = {
  [OpenAIModelID.GPT_3_5]: {
    id: OpenAIModelID.GPT_3_5,
    name: 'GPT-3.5',
    maxLength: 2990,
    tokenLimit: 4000,
    tokenLimitMargin: 1010,
    maxMessages: 10,
  },
  [OpenAIModelID.GPT_3_5_AZ]: {
    id: OpenAIModelID.GPT_3_5_AZ,
    name: 'GPT-3.5',
    maxLength: 2990,
    tokenLimit: 4000,
    tokenLimitMargin: 1010,
    maxMessages: 10,
  },
  [OpenAIModelID.GPT_4]: {
    id: OpenAIModelID.GPT_4,
    name: 'GPT-4',
    maxLength: 6800,
    tokenLimit: 8100,
    tokenLimitMargin: 1300,
    maxMessages: 15,
  },
  [OpenAIModelID.GPT_4_turbo]: {
    id: OpenAIModelID.GPT_4_turbo,
    name: 'GPT-4-Turbo',
    maxLength: 75000,
    tokenLimit: 128000,
    tokenLimitMargin: 1600,
    maxMessages: 20,
  },
  [OpenAIModelID.GPT_3_5_16K]: {
    id: OpenAIModelID.GPT_3_5_16K,
    name: 'GPT-3.5-16K',
    maxLength: 15100,
    tokenLimit: 16300,
    tokenLimitMargin: 1200,
    maxMessages: 12,
  },
  [OpenAIModelID.GPT_4O]: {
    id: OpenAIModelID.GPT_4O,
    name: 'GPT-4o',
    maxLength: 15100,
    tokenLimit: 128000,
    tokenLimitMargin: 3000,
    maxMessages: 20,
  },
};
