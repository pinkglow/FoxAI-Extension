
import { getLocalStorage, setLocalStorage } from "../utils";


export const GeminiDefaultHost = `https://generativelanguage.googleapis.com`;
const GeminiAPIUrl = "/v1/models/gemini-pro:streamGenerateContent?alt=sse&key=";

const getRequestBody = (prompt, maxOutputTokens, temperature) => {
  return {
    "contents": [
      {
        "role": "user",
        "parts": [
          {
            "text": prompt,
          }
        ]
      }
    ],
    "generationConfig": {
      "maxOutputTokens": maxOutputTokens,
      "stopSequences": [],
      "candidateCount": 1,
      "temperature": temperature,
      "topK": 1,
      "topP": 1
    },
    "safetySettings": [
      {
        "category": "HARM_CATEGORY_HARASSMENT",
        "threshold": "BLOCK_NONE"
      },
      {
        "category": "HARM_CATEGORY_HATE_SPEECH",
        "threshold": "BLOCK_NONE"
      },
      {
        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "threshold": "BLOCK_NONE"
      },
      {
        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
        "threshold": "BLOCK_NONE"
      }
    ]
  }
};


const getRequestUrl = async () => {
  const geminiHost = await getGeminiHost() || GeminiDefaultHost;
  try {
    const geminiAPIKey = await getGeminiAPIKey();
    return `${geminiHost}${GeminiAPIUrl}${geminiAPIKey}`;
  }
  catch (e) {
    console.log("获取 geminiAPIKey 失败");
    return null;
  }
};


export const geminiGenerate = async (prompt, maxTokens = 2000, temperature = 0.5, callback) => {
  console.log("genera param recv -> ", prompt, maxTokens, temperature);
  try {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let url = await getRequestUrl();
    fetch(`${url}`, {
      headers: headers,
      method: "POST",
      body: JSON.stringify(getRequestBody(prompt, maxTokens, temperature)),
    })
      .then(response => {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        async function read() {
          const { done, value } = await reader.read();
          if (done) {
            callback(null, done, null);
            return true;
          }
          let val = decoder.decode(value, { stream: true });
          let candidates = JSON.parse(val.slice(6,));
          let text = candidates.candidates[0].content.parts[0].text;
          console.log("收到的结果", text);
          callback(text, false, null);
          return read();
        }
        return read();
      })
      .catch((err) => {
        callback(null, false, err)
      })
  } catch (error) {
    callback(null, false, error)
  }
};


const getPromptSetting = (prompt, temperature, maxTokens) => {
  if (!temperature) temperature = 0.5;
  if (!maxTokens) maxTokens = 2000;
  return {
    prompt,
    temperature,
    maxTokens,
  }
};

const promptGenerators = {
  translate: (selection, language) => {
    return getPromptSetting(`You are a professional,authentic translation engine,only returns translations.
    Translate the content to ${language} Language: 
    ${selection}`, 0.1);
  },
  userPrompt: (selection, type, userPrompt) => {
    return getPromptSetting(`${userPrompt}`, 0.7);
  },
  userPromptWithSelection: (selection, type, userPrompt) => {
    return getPromptSetting(`You are a GPT, and as an assistant, I will provide you with text content. 
    <TEXT START>
    ${selection}
    <TEXT END>
   Now, applying the following guidelines , revise the above text. 
   <GUIDELINE START>
    ${userPrompt}
   <GUIDELINE END>
    `, 0.7);
  },
  improveWriting: (selection, type, userPrompt, outputLang) => {
    return getPromptSetting(`You are a GPT, and as an assistant, I will provide you with text content for correction. You are tasked to refine and enhance its quality. First, aim to clarify my sentences, steering clear of needlessly intricate words. Second, ensure the text has a logical flow and is comprehensible. Lastly, perform an exhaustive proofreading to eradicate any mistakes or typos. Now, applying the guidelines above, revise the following text. Please output in ${outputLang}. 
    ${selection}
    `, 0.7);
  },
  shorter: (selection, type, userPrompt, outputLang) => {
    return getPromptSetting(`You are a GPT. There are a few things that you should follow: 1. Fully understand the main idea. 2. Remove unnecessary or repetitive info. 3. Shorten long sentences. 4. Use simple language. 5. Highlight the most important information. 6. Aim to halve the word count. 7. Proofread for clarity and error-free content. 8. Retain the original meaning. Now, applying the guidelines above, revise the following text. Please output in ${outputLang}.
    ${selection}
    `, 0.5);
  },
  longer: (selection, type, userPrompt, outputLang) => {
    return getPromptSetting(`You are a GPT, I will provide you with text. You'll rewrite it and output it longer to be more than twice the number of characters of the original text. There are a few things that you should follow:

    1. Review the main points I want to convey. 
    2. Then, try to expand upon each point by adding more details, examples, or explanations. You can also try to anticipate any questions or objections that your audience may have, and address them in your text. 
    3. Another helpful strategy is to break up long paragraphs into shorter ones and use subheadings to organize my content. 
    4. Keep in mind that while it's important to make your text longer, it's equally important to ensure that it remains clear, concise, and engaging. 
    Please output in ${outputLang}. Here is the text you need to proceed: 
    ${selection}
    `, 0.5);
  },
  fixSpellingGrammar: (selection, type, userPrompt, outputLang) => {
    return getPromptSetting(`You will be provided with statements, and your task is to convert them to standard English. Now revise the following text. 
    ${selection}
    `, 0.7);
  },
  continueWriting: (selection, type, userPrompt, outputLang) => {
    return getPromptSetting(`Continue Writing the following content: 
    ${selection}  
    `, 0.7);
  },
  explainThis: (selection) => {
    return getPromptSetting(`Please explain the following content:
    ${selection}`, 0.5);
  },
  summarize: (selection) => {
    return getPromptSetting(`Please summarize the following content:
    ${selection}`, 0.5);
  }
  // 添加更多功能
};

export const generatePrompt = (functionName, outputLang, ...args) => {
  let generator;

  switch (functionName) {
    case 'English':
    case 'Chinese':
    case 'Spanish':
    case 'Russian':
    case 'French':
    case 'German':
    case 'Korean':
    case 'Japanese':
    case 'Italian':
    case "中文":
    case "日本語":
    case "русский":
    case "한국어":
    case "Deutsch":
    case "Français":
    case "Italiano":
      generator = promptGenerators['translate'];
      break;
    default:
      generator = promptGenerators[functionName];
  };

  if (!generator) {
    throw new Error(`未知的功能：${functionName}`);
  }

  return generator(...args, outputLang);
};

export const getGeminiAPIKey = async () => {
  const geminiAPIKey = await getLocalStorage("geminiAPIKey");
  return geminiAPIKey;
}

export const setGeminiAPIKey = async (geminiAPIKey) => {
  setLocalStorage("geminiAPIKey", geminiAPIKey);
};

export const getGeminiHost = async () => {
  const geminiHost = await getLocalStorage("foxaiGeminiHost");
  console.log("geminiHost storage -> ", geminiHost);
  return geminiHost || GeminiDefaultHost;
}

export const setGeminiHost = async (geminiHost) => {
  setLocalStorage("foxaiGeminiHost", geminiHost);
}
