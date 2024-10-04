function Process({ label, degree = 0, className = "text-sm" }) {
  return (
    <div className={`${className}`}>
      <span>{label}</span>
      <div className="grid grid-cols-[1fr_3rem] items-center justify-between">
        <div className={`h-[0.8rem] rounded-3xl bg-blue_3 overflow-hidden dark:bg-green_9`}>
          <div style={{ width: `${degree || 0}%` }} className={`h-full rounded-3xl bg-blue`} />
        </div>
        <span className="text-end">{degree || 0}%</span>
      </div>
    </div>
  );
}

export default Process;
