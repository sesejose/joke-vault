import { createContext } from "react";
// Importing the interfaces
import { interfaceJoke } from "../interfaces/interfaceJoke";
/** Define an interface or type for the context shape. */

export interface JokeContextType {
  // declaring on interfaces type for my context
  bookmarks: interfaceJoke[];
  setBookmarks: React.Dispatch<React.SetStateAction<interfaceJoke[]>>;
  // Declaring another type for another context
  mark: boolean;
  setMark: React.Dispatch<React.SetStateAction<boolean>>;
}

// Creating the context
const jokeContext = createContext<JokeContextType | null>(null);

export default jokeContext;
