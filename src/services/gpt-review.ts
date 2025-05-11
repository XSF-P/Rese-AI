import { AI_API_KEY } from "@/config/env";
import type { MovieReviewResponse } from "@/models/MovieReview";
import OpenAI from "openai";

interface GPTMovieReviewParams {
  title: string;
  score: number;
  reviews: MovieReviewResponse[];
}

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: AI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function getGPTMovieReview({
  title,
  score,
  reviews,
}: GPTMovieReviewParams) {
  const prompt = `Escribe un resumen de las valoraciones de la pelicula ${title} en español. La puntuación es ${score} de 10.

  Usa este tono según la puntuación de la pelicula:
  - De 0 a 3: Negativo
  - De 4 a 6: Neutral
  - De 7 a 10: Positivo
  Recibiras una lista de valoraciones de usuarios en diferentes idiomas pero deberas dar el resumen en español.
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

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "Eres un analista de comentarios en peliculas por usuarios que debes concretarlos en un único resumen con lo más relevante y critico.",
      },
      { role: "user", content: prompt },
    ],
    model: "qwen/qwen3-4b:free",
  });
  console.log(completion);

  return completion.choices[0].message.content;
}
