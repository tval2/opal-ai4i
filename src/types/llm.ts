export enum AllowedModelTypes {
  TEXT = "text",
  MULTIMODAL = "multimodal",
  EMBEDDING = "embedding",
}

export interface FunctionParameterProperties {
  type: string;
  description: string;
}

export interface FunctionDeclaration {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: {
      [key: string]: FunctionParameterProperties;
    };
    required: string[];
  };
}
