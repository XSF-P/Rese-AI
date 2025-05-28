import { AI_API_KEY } from "@/config/env";
import type { MovieReviewResponse } from "@/models/MovieReview";
import OpenAI from "openai";

interface GPTMovieReviewParams {
  title: string;
  score: number;
  reviews: MovieReviewResponse[];
  customModels?: string[]; // Modelos personalizados opcionales
}

// Lista de modelos predeterminados ordenados por preferencia
const DEFAULT_MODELS = [
  "google/gemma-3n-e4b-it:free",
  "meta-llama/llama-4-scout:free",
  "qwen/qwen2.5-vl-8b-instruct:free",
  "tngtech/deepseek-r1t-chimera:free",
  "microsoft/phi-4-reasoning-plus:free",
  "meta-llama/llama-4-maverick:free",
];

// Tiempo máximo para cada petición (en milisegundos)
const MODEL_TIMEOUT = 20000; // 20 segundos

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: AI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function getGPTMovieReview({
  title,
  score,
  reviews,
  customModels,
}: GPTMovieReviewParams) {
  const prompt = `Escribe un resumen de las valoraciones de la pelicula ${title} en español. La puntuación es ${score} de 10.

  Usa este tono según la puntuación de la pelicula:
  - De 0 a 3: Negativo
  - De 4 a 6: Neutral
  - De 7 a 10: Positivo
  Recibiras una lista de valoraciones de usuarios pero deberas dar el resumen en español.
  Tu objetivo es resaltar los temas más comunes y las emociones expresadas por los usuarios.
  Si hay varios temas, intenta capturar los más importantes.
  Intenta usar como máximo 40 palabras y 5 parrafos.
  No hagas referencias a puntuaciones concretas ni a la fecha de la valoración ni al usuario que lo valoro.
  
  Estas son las valoraciones de los usuarios:
  ${reviews
    .map((reviews) => `${reviews.content}. score: ${reviews.rating}/10`)
    .join("\n")}

  La estructura de respuesta debe ser solo texto limpio.
  `;

  const messages = [
    {
      role: "system" as const,
      content:
        "Eres un analista de comentarios en peliculas por usuarios que debes concretarlos en un único resumen con lo más relevante y critico.",
    },
    { role: "user" as const, content: prompt },
  ];

  // Usar modelos personalizados si se proporcionan, o los predeterminados si no
  const modelsToUse = customModels?.length ? customModels : DEFAULT_MODELS;

  let lastError = null;
  
  // Intentar cada modelo en secuencia
  for (const model of modelsToUse) {
    try {
      console.log(`Intentando con el modelo: ${model}`);
      
      // Crear una promesa con timeout para cada modelo
      const modelResponse = await Promise.race([
        openai.chat.completions.create({
          messages,
          model,
        }),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error(`Timeout alcanzado para ${model}`)), MODEL_TIMEOUT)
        )
      ]);
      
      console.log(`Modelo ${model} respondió correctamente`);
      return modelResponse.choices[0].message.content;
    } catch (error) {
      console.error(`Error con el modelo ${model}:`, error);
      lastError = error;
      console.log(`Pasando al siguiente modelo...`);
      // Continuar con el siguiente modelo
    }
  }

  // Si todos los modelos fallan, lanza el último error
  throw new Error(`Todos los modelos fallaron. Último error: ${lastError}`);
}
