function DotsLoader({ classNameDots = "", className = "" }) {
  return (
    <div className={`dots-loader w-[80px] h-[8px] ${className}`}>
      <div className={`w-[8px] h-[8px] bg-white dark:bg-blue ${classNameDots}`} />
      <div className={`w-[8px] h-[8px] bg-white dark:bg-blue ${classNameDots}`} />
      <div className={`w-[8px] h-[8px] bg-white dark:bg-blue ${classNameDots}`} />
      <div className={`w-[8px] h-[8px] bg-white dark:bg-blue ${classNameDots}`} />
    </div>
  );
}

export default DotsLoader;
