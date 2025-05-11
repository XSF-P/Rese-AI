import type { APIResponseWithPagination } from "./APIResponse";
import type { AuthorDetails } from "./AuthorDetails";

export interface MovieReview {
  author: string;
  author_details: AuthorDetails;
  content: string;
  created_at: string;
  id: string;
  updated_at: string;
  url: string;
}

export interface MovieReviewResponse {
  rating: number;
  content: string;
}

export type MovieReviewPagination = APIResponseWithPagination<MovieReview>;
