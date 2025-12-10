
export interface Pose {
  description: string;
  aiPrompt: string;
}

export interface Concept {
  conceptName: string;
  salesGoal: {
    emotionalTrigger: string;
    usp: string;
    perceivedValue: string;
  };
  context: {
    location: string;
    lighting: string;
    colorPalette: string;
    vibe: string;
  };
  poses: Pose[];
  style: {
    makeupAndHair: string;
    garmentNotes: string;
  };
  finalAiPrompt: string;
}

export type ModelOption = 
  | 'Model Hàn Quốc' 
  | 'Model Việt Nam' 
  | 'Model Trung Quốc' 
  | 'Model Nàng thơ hiện đại';

export interface ImageInput {
  file: File;
  previewUrl: string;
  label: string;
  id: string;
  required: boolean;
}
