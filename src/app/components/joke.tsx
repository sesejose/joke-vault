export default function Joke({ id, text }: { id: string; text: string }) {
  return (
    <>
      <li className="flex flex-wrap sm:flex-column md:flex-row justify-between gap-x-6 py-5 gap-5">
        <div className="flex gap-x-4">
          <div className="min-w-0 flex-auto">
            <p className="text-lg font-semibold text-gray-900">{text}</p>
            <p className="mt-1 truncate text-sm text-gray-500">ID: {id}</p>
          </div>
        </div>
        <div className="shrink-0 sm:flex sm:flex-col sm:items-end">
          <button
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            onClick={() => {
              const joke = text;
              const utterance = new SpeechSynthesisUtterance(joke);
              // utterance.pitch = 1;
              // utterance.rate = 1;
              // utterance.volume = 1;
              speechSynthesis.speak(utterance);
            }}
          >
            Listen it
          </button>
          <p className="text-md text-gray-900"></p>
          {/* <p className="mt-1 text-xs/5 text-gray-500">Lyd</p> */}
        </div>
      </li>
      {/* This is a Joke: {text} with the id: {id} */}
    </>
  );
}
