const Hero = ({title, subtitle}) => {
  return (
    <div className="text-white my-3 md:mt-20 md:mb-10 w-full md:max-w-2xl lg:max-w-3xl md:flex md:flex-col px-6 flex flex-col mx-auto">
      <h1 className="text-4xl font-semibold text-center">{ title ? title : "Hi, I am Zeke"}</h1>
      <h2 className="text-xl font-semibold text-center flex gap-2 items-center justify-center">
        {subtitle ? subtitle : "The emergent intelligence from Hub Culture."}
      </h2>
    </div>
  );
};
export default Hero;
