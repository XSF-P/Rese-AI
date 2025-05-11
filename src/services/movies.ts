import { MOVIES_API_KEY, MOVIES_API_URL } from "@/config/env";
import type { MovieAPIPagination, MovieResponse } from "@/models/Movie";
import type { MovieDetails, MovieDetailsResponse } from "@/models/MovieDetails";
import { ApiError } from "@/utils/errors/ApiError";

type GetMoviesParams = {
  lang?: string;
  page?: number;
  genre?: string;
};

type GetMovieByIdParams = {
  id: string;
  lang?: string;
};

export async function getMovies({
  lang = "en-US",
  page = 1,
  genre,
}: GetMoviesParams = {}): Promise<MovieResponse[]> {
  const URL_REQUEST = new URL(
    `${MOVIES_API_URL}/discover/movie?include_video=false&page=${page}&sort_by=popularity.desc&language=${lang}`
  );

  if (genre !== undefined)
    URL_REQUEST.searchParams.append("with_genres", genre);

  const res: MovieAPIPagination = await fetch(URL_REQUEST.toString(), {
    headers: {
      Authorization: `Bearer ${MOVIES_API_KEY}`,
      Accept: "application/json",
    },
  })
    .then((res) => {
      if (res.status !== 200)
        throw new ApiError("Ooops! we were unable to obtain the movies");
      return res.json();
    })
    .catch((err) => err);

  const movies: MovieResponse[] = res.results.map((movie) => ({
    id: String(movie.id),
    title: movie.title,
    overview: movie.overview,
    poster: movie.poster_path,
    popularity: movie.popularity,
    vote_average: movie.vote_average,
    release_date: new Date(movie.release_date),
  }));

  return movies;
}

export async function getMovieById({
  id,
  lang = "en-US",
}: GetMovieByIdParams): Promise<MovieDetailsResponse> {
  const URL_REQUEST = new URL(`${MOVIES_API_URL}/movie/${id}?language=${lang}`);

  const res: MovieDetails = await fetch(URL_REQUEST.toString(), {
    headers: {
      Authorization: `Bearer ${MOVIES_API_KEY}`,
      Accept: "application/json",
    },
  })
    .then((res) => {
      if (res.status !== 200)
        throw new ApiError("Ooops! we were unable to obtain the movies");
      return res.json();
    })
    .catch((err) => err);

  const movies: MovieDetailsResponse = {
    id: String(res.id),
    title: res.title,
    backdrop_poster: res.backdrop_path,
    overview: res.overview,
    poster: res.poster_path,
    popularity: res.popularity,
    vote_average: res.vote_average,
    release_date: new Date(res.release_date),
  };

  return movies;
}
