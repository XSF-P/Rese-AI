import { getGPTMovieReview } from "@/services/gpt-review";
import { getMovieReview } from "@/services/movie-review";
import { VoteAverage } from "./VoteAverage";

interface MovieCardProps {
  id: string;
  title: string;
  voteAverage: number;
  poster: string;
  release_date: Date;
}

const voteColors = {
  bad: {
    bg: "bg-red-950",
    border: "border-red-500",
  },
  normal: {
    bg: "bg-amber-950",
    border: "border-amber-500",
  },
  good: {
    bg: "bg-green-950",
    border: "border-green-500",
  },
};

export function MovieCard({
  id,
  title,
  voteAverage,
  poster,
  release_date,
}: MovieCardProps) {
  MovieCard;
  const voteColor =
    voteAverage < 3.33
      ? voteColors.bad
      : voteAverage < 6.66
      ? voteColors.normal
      : voteColors.good;

  return (
    <a href={`/movies/${id}`}>
      <article className="group cursor-pointer">
        <div className="relative overflow-hidden rounded-2xl">
          <img
            className="group-hover:scale-110 transition-transform w-full h-full object-cover object-center"
            loading="lazy"
            height={330}
            width={220}
            src={`https://media.themoviedb.org/t/p/w220_and_h330_face${poster}`}
            alt={`${title} poster`}
          />
          <VoteAverage average={voteAverage} />
        </div>
        <div className="py-2">
          <h3 className="group-hover:text-blue-500 text-lg font-bold">
            {title}
          </h3>
          <p>{release_date.getFullYear()}</p>
        </div>
      </article>
    </a>
  );
}
