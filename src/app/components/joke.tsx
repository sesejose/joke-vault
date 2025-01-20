"use client";

import { useContext, useState } from "react";
import jokeContext, { JokeContextType } from "./jokeContext";
import Image from "next/image";

export default function Joke({ id, text }: { id: string; text: string }) {
  // Bookmark and Star
  // Importing and using the context
  const context = useContext(jokeContext);
  // Star icon just to show in in the DOM
  const [star, setStar] = useState<boolean>(false);

  // function markAsFunny(context: JokeContextType) {
  //   // const btnStar = event.target.value;
  //   if (context.mark === true) {
  //     context.setMark(false);
  //     // console.log(context.mark);
  //   } else {
  //     context.setMark(true);
  //     // console.log(context.mark);
  //     addToBookmarks(context);
  //   }
  // }

  function addToBookmarks(context: JokeContextType) {
    // I check if this joke is already in bookmarks
    // There are no bookmarks yet on it
    const isBookmarked = context.bookmarks.some((joke) => joke.id === id);

    if (isBookmarked) {
      // But if it was there, remove it
      const updated = context.bookmarks.filter((joke) => joke.id !== id);
      context.setBookmarks(updated);
    } else {
      // Otherwise, add it
      context.setBookmarks((arr) => [...arr, { id, joke: text }]);
    }
    // console.log(context.bookmarks);
    // I have the the bookmarks now - I should just define filtered jokes on Home
  }

  if (!context) {
    return <p>No Provider found</p>;
  }

  return (
    <>
      <li className="relative flex flex-wrap sm:flex-column md:flex-row justify-between gap-x-6 py-5 gap-5">
        <div className="flex gap-x-4">
          <div className="sm:flex md:flex sm:flex-col md:flex-row gap-5 items-center">
            <button
              onClick={() => {
                if (star === true) {
                  setStar(false);
                  addToBookmarks(context);
                } else {
                  setStar(true);
                  addToBookmarks(context);
                }
              }}
            >
              {/* Add to bookmarks */}
              {star ? <Image aria-hidden src="/added.svg" alt="star icon" width={24} height={24} /> : <Image aria-hidden src="/removed.svg" alt="star icon" width={24} height={24} />}
            </button>
            <div>
              <p className="text-lg font-semibold text-gray-900 pt-5 sm:pt-5 md:pt-0">{text}</p>
            </div>
            <div>
              <p className="hidden mt-1 truncate text-sm text-gray-500">ID: {id}</p>
            </div>
          </div>
        </div>

        <div className="shrink-0 sm:flex sm:flex-col sm:items-end absolute right-0 sm:bottom-15 md:bottom-2.5">
          <button
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-amber-500 text-background gap-2 hover:bg-amber-600 dark:hover:bg-amber-600 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            onClick={() => {
              const joke = text;
              const utterance = new SpeechSynthesisUtterance(joke);
              // utterance.pitch = 1;
              // utterance.rate = 1;
              // utterance.volume = 1;
              speechSynthesis.speak(utterance);
            }}
          >
            <Image aria-hidden src="/soundwave.svg" alt="star icon" width={16} height={16} />
            <p className="sm:text-base text-sm text-white">Listen it</p>
          </button>
          <p className="text-md text-gray-900"></p>
          {/* <p className="mt-1 text-xs/5 text-gray-500">Lyd</p> */}
        </div>
      </li>
      {/* This is a Joke: {text} with the id: {id} */}
    </>
  );
}
