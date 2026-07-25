export interface AnalysisResult {
  indonesian: string
  english: string
  keywords: string[]
  tags: string[]
  style: string
  negativePrompt: string
  summary: string
  details: {
    objects: string[]
    people: string[]
    clothing: string[]
    expressions: string[]
    poses: string[]
    background: string
    lighting: string
    colors: string[]
    camera: string
    angle: string
    quality: string
    photoStyle: string
    atmosphere: string
    smallDetails: string[]
  }
}

export interface HistoryItem {
  id: string
  timestamp: number
  imageName: string
  prompt: AnalysisResult
}

export type PromptLength = 'low' | 'medium' | 'high' | 'ultra'
export type Language = 'id' | 'en'