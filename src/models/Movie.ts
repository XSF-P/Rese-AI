import type { APIResponseWithPagination } from "./APIResponse";

export interface Movie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface MovieResponse {
  id: string;
  title: string;
  poster: string;
  overview: string;
  popularity: number;
  vote_average: number;
  release_date: Date;
}

export type MovieAPIPagination = APIResponseWithPagination<Movie>;
