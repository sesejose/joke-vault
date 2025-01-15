// Data I have access to: total_jokes: number, total_pages: number, current_page: number,
// -------------------------------------------
// "current_page": 1,
// "limit": 20,
// "next_page": 2,
// "previous_page": 1,
// "search_term": "",
// "status": 200,
// "total_jokes": 307,
// "total_pages": 15
// ------------------------------------------
// There are 25 pages and I can fetch 1 page at a time.
// I can fecth several times and store/push array to a main array of objects (jokes)
// ------------------------------------------

"use client";

import { useEffect, useState } from "react";
import Joke from "../components/joke";

interface Joke {
  id: string;
  joke: string;
}

// ----------------------------

export default function JokeFetcher() {
  const [allJokes, setAllJokes] = useState<Joke[]>([]);
  const [totalJokes, setTotalJokes] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    (async function fetchAllJokes() {
      const page = 1;
      let totalPages = 1;
      const jokes: Joke[] = [];

      async function fetchOnePage(currentPage: number) {
        const url = `https://icanhazdadjoke.com/search?limit=30&page=${currentPage}`;
        const res = await fetch(url, { headers: { Accept: "application/json" } });
        const data = await res.json();
        jokes.push(...data.results);
        totalPages = data.total_pages;
        setTotalJokes(data.total_jokes);
        console.log("Total Pages", totalPages - currentPage);
        if (currentPage < totalPages) {
          return fetchOnePage(currentPage + 1);
        }
      }

      await fetchOnePage(page); // starts recursion
      setAllJokes(jokes);
      setLoading(false);
    })();
  }, []);

  // ----------------------

  return (
    <>
      {loading ? (
        <p>Loading all jokes...</p>
      ) : (
        // <div>There are {totalJokes} totl jokes.</div>
        <ul className="mx-10 my-10">
          {allJokes.map((joke) => (
            <Joke key={joke.id} id={joke.id} text={joke.joke} />
          ))}
        </ul>
      )}
      {/* <p>There are actually {totalJokes} total jokes in this vault.</p> */}
    </>
  );
}
