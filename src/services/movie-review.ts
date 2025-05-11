import { MOVIES_API_KEY, MOVIES_API_URL } from "@/config/env";
import type {
  MovieReviewPagination,
  MovieReviewResponse,
} from "@/models/MovieReview";
import { ApiError } from "@/utils/errors/ApiError";

type GetMovieReviewParams = {
  id: string;
  lang?: string;
  page?: number;
};

export async function getMovieReview({
  id,
  lang = "en-US",
  page = 1,
}: GetMovieReviewParams): Promise<MovieReviewResponse[]> {
  const res: MovieReviewPagination = await fetch(
    `${MOVIES_API_URL}/movie/${id}/reviews?language=${lang}&page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${MOVIES_API_KEY}`,
        Accept: "application/json",
      },
    }
  )
    .then((res) => {
      if (res.status !== 200)
        throw new ApiError("Ooops! we were unable to obtain the movie reviews");
      return res.json();
    })
    .catch((err) => err);

  const reviews: MovieReviewResponse[] = res.results.map(
    ({ content, author_details }) => ({
      content,
      rating: author_details.rating,
    })
  );

  return reviews;
}
