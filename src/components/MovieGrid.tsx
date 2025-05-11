import { use, useEffect, useRef, useState } from "react";
import { MovieCard } from "@/components/MovieCard";
import type { MovieResponse } from "@/models/Movie";
import { getMovies } from "@/services/movies";

export function MovieGrid() {
  const [movies, setMovies] = useState<MovieResponse[]>([]);
  const page = useRef<number>(1);
  const intersectorRef = useRef<HTMLDivElement>(null);

  const onIntersection: IntersectionObserverCallback = async (
    entries,
    observer
  ) => {
    const el = entries[0];

    if (el.isIntersecting) {
      getMovies({ page: page.current })
        .then((res) => {
          setMovies((state) => state.concat(res));
        })
        .catch((err) => console.error(err));
      page.current += 1;
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(onIntersection, {
      rootMargin: "150px",
    });

    observer.observe(intersectorRef.current!);
  }, []);

  return (
    <section>
      <div className="container grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            voteAverage={movie.vote_average}
            poster={movie.poster}
            release_date={movie.release_date}
          />
        ))}
      </div>
      <div ref={intersectorRef} />
    </section>
  );
}
