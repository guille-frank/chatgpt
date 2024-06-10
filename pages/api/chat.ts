import { DEFAULT_SYSTEM_PROMPT, DEFAULT_TEMPERATURE } from '@/utils/app/const';
import { OpenAIError, OpenAIStream } from '@/utils/server';

import { ChatBody, Message } from '@/types/chat';

// @ts-expect-error
import wasm from '../../node_modules/@dqbd/tiktoken/lite/tiktoken_bg.wasm?module';

import tiktokenModel from '@dqbd/tiktoken/encoders/cl100k_base.json';
import { Tiktoken, init } from '@dqbd/tiktoken/lite/init';

const summarizeLastMessages = async (messages: string, length: number): Promise<string> => {
  const url = 'https://text-analysis12.p.rapidapi.com/summarize-text/api/v1.1';
  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': 'a9d08d2d45msh7bfb46fa28790c7p159dd5jsn28266a2083f1',
      'X-RapidAPI-Host': 'text-analysis12.p.rapidapi.com',
    },
    body: JSON.stringify({
      language: 'english',
      summary_percent: 15,
      text: messages,
    }),
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    if (result.ok && result.summary !== undefined) {
      return result.summary;
    } else {
      console.error('Error:', result.msg);
      throw new Error('Summary extraction failed');
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const config = {
  runtime: 'edge',
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const { model, messages, key, prompt, temperature } = (await req.json()) as ChatBody;

    await init((imports) => WebAssembly.instantiate(wasm, imports));
    const encoding = new Tiktoken(
      tiktokenModel.bpe_ranks,
      tiktokenModel.special_tokens,
      tiktokenModel.pat_str,
    );
    const MAX_MESSAGES = model.maxMessages;
    const TOKEN_LIMIT_MARGIN = model.tokenLimitMargin;
    let context = "";

    if (messages.length > 2) {
      const lastMessagesCount = Math.min(messages.length, 10);
      const lastMessages = messages.slice(messages.length - lastMessagesCount);

      const combinedMessagesContent = lastMessages.map((message) => message.content).join('\n');
      context = `Context: ${combinedMessagesContent}\n\n`;
    }

    let promptToSend = `${context}$\n${(prompt || DEFAULT_SYSTEM_PROMPT)}`;
    let temperatureToUse = temperature ?? DEFAULT_TEMPERATURE;

    const prompt_tokens = encoding.encode(promptToSend);

    let tokenCount = prompt_tokens.length;
    let mensajes = 0;
    let messagesToSend: Message[] = [];

    for (let i = messages.length - 1; i >= 0 && mensajes < 2; i--) {
      const message = messages[i];
      const messageToken = encoding.encode(message.content);
      const totalTokens = tokenCount + messageToken.length;

      if ((totalTokens + TOKEN_LIMIT_MARGIN > model.tokenLimit) || mensajes >= 2) {
        break;
      }
      mensajes++;
      tokenCount += totalTokens;
      messagesToSend = [message, ...messagesToSend];
    }
    console.log("(Aproximados)Tokens Utilizados: " + tokenCount);

    encoding.free();

    const stream = await OpenAIStream(model, promptToSend, temperatureToUse, key, messagesToSend);

    return new Response(stream);
  } catch (error) {
    console.error(error);
    if (error instanceof OpenAIError) {
      return new Response('Error', { status: 500, statusText: error.message });
    } else {
      return new Response('Error', { status: 500 });
    }
  }
};

export default handler;
