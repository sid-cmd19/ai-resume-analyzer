import GaugeChart from "./GaugeChart";

const ScoreGauge = ({ score = 75 }: { score: number }) => {
  const percentage = score / 100;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-20">
        <GaugeChart percentage={percentage} />
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
          <div className="text-xl font-semibold pt-4">{score}/100</div>
        </div>
      </div>
    </div>
  );
};

export default ScoreGauge;
