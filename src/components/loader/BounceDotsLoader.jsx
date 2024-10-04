function BounceDotsLoader({ className = "", classNameDots = "h-6 w-6 bg-blue" }) {
  return (
    <div className={`flex space-x-2 justify-center items-center ${className}`}>
      <div className={`rounded-full animate-bounce [animation-delay:-0.3s] ${classNameDots}`} />
      <div className={`rounded-full animate-bounce [animation-delay:-0.15s] ${classNameDots}`} />
      <div className={`rounded-full animate-bounce ${classNameDots}`} />
    </div>
  );
}

export default BounceDotsLoader;
