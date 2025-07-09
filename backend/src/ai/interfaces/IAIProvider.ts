export interface IAIProvider {
  generateCompletion(prompt: string): Promise<string>;
  isAvailable(): boolean;
}
