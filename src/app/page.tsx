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
import Joke from "./components/joke";
import Image from "next/image";
import jokeContext from "./components/jokeContext";
import { interfaceJoke } from "./interfaces/interfaceJoke";

export default function Home() {
  const [allJokes, setAllJokes] = useState<interfaceJoke[]>([]);
  const [totalJokes, setTotalJokes] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  // To put together all the jokes that match the filter
  const [filteredJokes, setFilteredJokes] = useState<interfaceJoke[]>([]);
  // Filter - when selected fom the list should change the state
  const [filter, setFilter] = useState<string>("All jokes");
  // Search
  const [searchTerm, setSearchTerm] = useState<string>("");
  // Array of words (strings) to store the terms from the search
  const [terms, setTerms] = useState<string[]>([]);
  // Variables and States used in Load more
  const initialJokeList = 6; // Number of jokes to display initially.
  const incrementInitialJokeList = 6; // Number of jokes to add each time the "load more" button is clicked.
  // Load more state to display jokes initially
  const [displayJokes, setDisplayJokes] = useState(initialJokeList);
  // ----------------------------------
  // Bookmarks
  const [mark, setMark] = useState<boolean>(false);
  // Array with those that where marked
  const [bookmarks, setBookmarks] = useState<interfaceJoke[]>([]);

  // const context = useContext(jokeContext);

  // -------------------------------

  useEffect(() => {
    setLoading(true);

    (async function fetchAllJokes() {
      const page = 1;
      let totalPages = 1;
      const jokes: interfaceJoke[] = [];

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
      // I also set the state for filteredJokes as initial value.
      // It state changes later with the filters.
      setFilteredJokes(jokes);
      setLoading(false);
    })();
  }, []);

  // ----------------------    Filter   --------------------------------------

  // Select Option to set the filter (setState for filter).
  // I should check what is the filter selected and see if it match with option value.
  // If yes filter the array allJokes e.g. --> .filter() and then return / set a new setFilteredJokes(state).
  // e.g. if the joke.text ( string ) lenght is lower that 30 return a new state

  function handleFilterSelected(event: React.ChangeEvent<HTMLSelectElement>) {
    const filterSelected = event.target.value;
    setFilter(filterSelected);
    if (filterSelected === "Shorter") {
      const filterShorter = allJokes.filter((joke) => joke.joke.length <= 80);
      // console.log(filterShorter); // console to see how many - now I should display them, replace by allJokes.
      return setFilteredJokes(filterShorter);
    }
    if (filterSelected === "Larger") {
      const filterLarger = allJokes.filter((joke) => joke.joke.length >= 80);
      // console.log(filterLarger); // console to see how many - now I should display them, replace by allJokes.
      return setFilteredJokes(filterLarger);
    }
    if (filterSelected === "All jokes") {
      return setFilteredJokes(allJokes);
    }
    console.log(filter);
  }

  // ----------------------------    Search    ------------------------------------

  // I define the state for the Searched Term
  // I will use it to loop through the joke text an see if it includes that term.
  function searchOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.target.value);
  }

  function searchOnSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const filtered = filteredJokes.filter((joke) => {
      const text = searchTerm.toLowerCase();
      return joke.joke.toLowerCase().includes(text);
    });
    setFilteredJokes(filtered);
    console.log(searchTerm);
    // Once I have the term I push it to the array of terms
    // First define a const for that array and indicate the what I do expect ( an Array of strings n this case ).
    const arrTerms: string[] = terms;
    // Then as I did with the jokes I push the term to that array.
    // I have declared a const to push it to first because I can in order to
    arrTerms.push(searchTerm);
    console.log("Pushed Term:", arrTerms);
    setTerms(arrTerms);
    console.log("Terms from Search:", terms);
  }

  // ---------------- Add to Bookmarks

  // function add(context): {

  // }

  // -------------------------------------   Load More Jokes   --------------------------------------------------

  // Loading more Jokes

  // 1) Declare a variabe with the amount of jokes to display initially.
  // 2) Then another variable with the amount I want to show / add after clicking on the Load more jokes button.
  // 3) And a ( let) variable - const State in React - with the amount of jokes to display initially - The State of this is the const declared previouslly in (1).
  // 4) After having that data add the event to button Load more to callback the function that will set the new setState for displayJokes (3).
  // 5) The new state should be the original displayJokes declared at 1) and 3) PLUS those that I want to increment - State declared at 2).
  // 6) That new state is the piece I want to SLICE from the filteredJokes main list.

  // Function triggered by event "Load more"
  const loadMore = () => {
    setDisplayJokes(displayJokes + incrementInitialJokeList);
  };

  // ----------------------------------------------------------------------------------------------------------
  return (
    <>
      <jokeContext.Provider value={{ mark, setMark, bookmarks, setBookmarks }}>
        <div>
          <main>
            <div className="bg-white p-10">
              <section className="flex flex-wrap md:flex-nowrap sm:flex-column md:flex-row sm:columns-1 md:columns-3 md:space-around md:items-center w-full gap-10">
                <div className="flex sm:flex-column flex-wrap w-full text-center justify-center">
                  <div className="flex flex-row flew-wrap w-full text-center justify-center text-3xl font-extrabold p-5">
                    <a href="">The Joke Vault</a>
                  </div>
                  {/* <div className="flex flex-row justify-center text-sm p-5">
                There were found
                <div>
                  <p className="font-semibold pl-1 pr-1">{filteredJokes.length}</p>
                </div>
                jokes.
              </div> */}
                </div>

                <div id="search" className="flex flex-row w-full text-center justify-center p-5 rounded-full">
                  <div className="">
                    <form className="form-search" action="search" onSubmit={searchOnSubmit}>
                      <label htmlFor="search-field"></label>
                      <div className="flex flex-row">
                        <input
                          id="search-field"
                          className="p-2 rounded-tl-lg rounded-bl-lg bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:gray-500 focus:border-gray-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                          type="text"
                          placeholder="Console after submit..."
                          name="search"
                          value={searchTerm}
                          onChange={searchOnChange}
                        />
                        <button className="magnify" type="submit">
                          <span className="rounded-tr-lg rounded-br-lg border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5">
                            search
                          </span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                <form className="flex flex-wrap flex-column w-full text-center justify-center">
                  {/* Filter Options Desktop */}
                  {/* <div className="w-full p-5">Filter</div> */}
                  <select
                    id="filter-desk"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500 columns-1 w-1/2 m-5 p-5 rounded-lg"
                    onChange={handleFilterSelected}
                  >
                    {/* <optgroup label="Option Group" className="group"> */}
                    <option value="All jokes">All jokes</option>
                    <option value="Shorter">Shorter</option>
                    <option value="Larger">Larger</option>
                    {/* </optgroup> */}
                  </select>
                </form>
              </section>
            </div>

            <section className="container mx-auto">
              <div className="flex flex-row justify-start w-full text-sm p-5">
                There were found
                <div>
                  <p className="font-semibold pl-1 pr-1">{filteredJokes.length}</p>
                </div>
                jokes.
              </div>

              {loading ? (
                <div className="container flex justify-center columns-1 text-center p-20">
                  <p>Loading all jokes...</p>
                </div>
              ) : (
                // <div>There are {totalJokes} totl jokes.</div>
                <ul className="p-5 divide-y">
                  {filteredJokes.slice(0, displayJokes).map((joke) => (
                    <Joke key={joke.id} id={joke.id} text={joke.joke} />
                  ))}
                </ul>
              )}
            </section>

            {/* Load More Button */}
            <section className="bg-white pb-20 pt-20">
              <div className="">
                <div className="columns-1 flex flex-row justify-center">
                  {displayJokes < filteredJokes.length && (
                    <button
                      onClick={loadMore}
                      className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                    >
                      Load more jokes
                    </button>
                  )}
                </div>
                <div className="flex flex-row justify-center text-sm p-5">
                  There are actually
                  <div>
                    <p className="font-semibold pl-1 pr-1">{totalJokes}</p>
                  </div>
                  total jokes in this vault.
                </div>
              </div>
            </section>
          </main>
          <footer className="bg-foreground row-start-3 flex gap-6 flex-wrap items-center justify-center p-20">
            <a className="text-white flex items-center gap-2 hover:underline hover:underline-offset-4" href="https://github.com/sesejose" target="_blank" rel="noopener noreferrer">
              <Image aria-hidden src="/globe.svg" alt="Globe icon" width={16} height={16} />
              GitHub →
            </a>
            <a className="text-white flex items-center gap-2 hover:underline hover:underline-offset-4" href="https://grapixmo.com/" target="_blank">
              <Image aria-hidden src="/globe.svg" alt="File icon" width={16} height={16} />
              Web →
            </a>
            <a className="text-white flex items-center gap-2 hover:underline hover:underline-offset-4" href="https://www.linkedin.com/in/sesejose/" target="_blank" rel="noopener noreferrer">
              <Image aria-hidden src="/file.svg" alt="Window icon" width={16} height={16} />
              Linkedin →
            </a>
          </footer>
        </div>
      </jokeContext.Provider>
    </>
  );
}
