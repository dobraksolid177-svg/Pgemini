import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function analyzeImage(imageBase64: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })

  const prompt = `Anda adalah ahli analisis gambar profesional. Analisis gambar ini secara mendetail dan berikan output dalam format JSON yang valid dengan struktur berikut:

{
  "indonesian": "Prompt dalam Bahasa Indonesia yang sangat detail dan natural",
  "english": "Prompt in English that is very detailed and natural",
  "keywords": ["keyword1", "keyword2", ...],
  "tags": ["tag1", "tag2", ...],
  "style": "Gaya fotografi yang digunakan",
  "negativePrompt": "Apa yang harus dihindari dalam prompt",
  "summary": "Ringkasan singkat tentang isi gambar",
  "details": {
    "objects": ["objek1", "objek2", ...],
    "people": ["deskripsi orang", ...],
    "clothing": ["deskripsi pakaian", ...],
    "expressions": ["deskripsi ekspresi", ...],
    "poses": ["deskripsi pose", ...],
    "background": "Deskripsi latar belakang",
    "lighting": "Deskripsi pencahayaan",
    "colors": ["warna1", "warna2", ...],
    "camera": "Jenis kamera atau setting kamera",
    "angle": "Sudut pengambilan gambar",
    "quality": "Kualitas gambar",
    "photoStyle": "Gaya foto",
    "atmosphere": "Suasana gambar",
    "smallDetails": ["detail1", "detail2", ...]
  }
}

Analisis dengan sangat detail dan profesional. Perhatikan setiap elemen dalam gambar.`

  try {
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: imageBase64,
        },
      },
    ])

    const response = await result.response
    const text = response.text()
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Invalid response format')
    }

    return JSON.parse(jsonMatch[0])
  } catch (error) {
    console.error('Error analyzing image:', error)
    throw error
  }
}