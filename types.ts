export interface ExampleSentence {
  chinese: string;
  pinyin: string;
  meaning: string;
}

export interface CharacterData {
  character: string;
  pinyin: string;
  definition: string;
  radical: string;
  strokeCount: number;
  etymology: string; // Origin/Story
  examples: ExampleSentence[];
}

// Type definition for the global HanziWriter object loaded via CDN
export interface HanziWriterInstance {
  animateCharacter: (options?: { onComplete?: () => void }) => void;
  loopCharacterAnimation: () => void;
  hideCharacter: () => void;
  showCharacter: () => void;
  quiz: (options?: any) => void;
  cancelQuiz: () => void;
  setCharacter: (char: string) => void;
}

export interface HanziWriterStatic {
  create: (element: HTMLElement | string, character: string, options?: any) => HanziWriterInstance;
}

declare global {
  interface Window {
    HanziWriter: HanziWriterStatic;
  }
}