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

interface Term {
  term: string;
}

// ----------------------------

export default function JokeFetcher() {
  const [allJokes, setAllJokes] = useState<Joke[]>([]);
  const [totalJokes, setTotalJokes] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  // To put together all the jokes that match the filter
  const [filteredJokes, setFilteredJokes] = useState<Joke[]>([]);
  // Filter - when selected fom the list should change the state
  const [filter, setFilter] = useState<string>("All jokes");
  const [shorter, setShorter] = useState<number>(0);
  const [larger, setLarger] = useState<number>(0);
  // Search
  const [searchTerm, setSearchTerm] = useState<string>("");
  // Array of words (strings) to store the terms from the search
  const [terms, setTerms] = useState<string[]>([]);

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
      // I also set the state for filteredJokes as initial value.
      // It state changes later with the filters.
      setFilteredJokes(jokes);
      setLoading(false);
    })();
  }, []);

  // ---------------------- Filter --------------------------------------

  // I should check what is the filter selected and see if it match with option value.
  // If yes filter the array allJokes e.g. --> .filter() and then return / set a new setFilteredJokes(state).
  // e.g. if the joke.text ( string ) lenght is lower that 30 return a new state

  function handleFilterSelected(event) {
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
  }

  // ---------------------------- Search ------------------------------------

  // I define the state for the Searched Term
  // I will use it to loop through the joke text an see if it includes that term.
  function searchOnChange(event) {
    setSearchTerm(event.target.value);
  }

  function searchOnSubmit(event) {
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

  return (
    <>
      <div className="container">
        <div id="search" className="">
          <div className="">
            <form className="form-search" action="search" onSubmit={searchOnSubmit}>
              <label htmlFor="search-field"></label>
              <div className="input-group flex-row-center">
                <input id="search-field" className="input" type="text" placeholder="Search.." name="search" value={searchTerm} onChange={searchOnChange} />
                <button className="magnify" type="submit">
                  <span className="material-symbols-rounded">search</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="">
          <p>There where filtered {filteredJokes.length} jokes from the general list.</p>
          <p>There are actually {totalJokes} total jokes in this vault.</p>
          {/* Filter Options Desktop */}
          <div className="">Filter</div>
          <select id="filter-desk" required="" className="filter-options" onChange={handleFilterSelected}>
            {/* <optgroup label="Option Group" className="group"> */}
            <option value="All jokes">All jokes</option>
            <option value="Shorter">Shorter</option>
            <option value="Larger">Larger</option>
            {/* </optgroup> */}
          </select>
        </div>
      </div>
      {loading ? (
        <p>Loading all jokes...</p>
      ) : (
        // <div>There are {totalJokes} totl jokes.</div>
        <ul className="mx-10 my-10 divide-y">
          {filteredJokes.map((joke) => (
            <Joke key={joke.id} id={joke.id} text={joke.joke} />
          ))}
        </ul>
      )}
    </>
  );
}
