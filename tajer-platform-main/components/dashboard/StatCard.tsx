import CountUp from "react-countup";

 
type StatCardProps = {
  title: string;
  value: number;
  icon: React.ReactNode;
  loading?: boolean;
};

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, loading }) => {

  return (
    <div className="flex items-center border-1 hover:border-[var(--primary)] duration-300 rounded-2xl h-[100px] p-5 w-[100%] shadow">
      <div className="text-[var(--primary)]">{icon}</div>
      <div className="flex flex-col mr-4">
        <span className="text-3xl font-bold w-full">
          {loading ? (
            <span className="animate-pulse bg-muted  rounded w-20 h-8 block"></span>
          ) : (
            <div>
              <CountUp end={value} duration={2.5} />
              {title === 'Total Spent' ? " JD" : title === 'Cashback' ? " JD" : ""}
            </div>
          )}
        </span>
        <h2>{title}</h2>
      </div>
    </div>
  );
};
