interface VoteAverageProps {
  average: number;
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

export function VoteAverage({ average }: VoteAverageProps) {
  const voteColor =
    average < 3.33
      ? voteColors.bad
      : average < 6.66
      ? voteColors.normal
      : voteColors.good;

  return (
    <div
      className={`absolute bottom-2 right-2 ${voteColor.bg} ${voteColor.border} text-white p-2 border-4 rounded-full`}
    >
      {Math.round(average * 10)}
      <span className="text-xs align-super">%</span>
    </div>
  );
}
