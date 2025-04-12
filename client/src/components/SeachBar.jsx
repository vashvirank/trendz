import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?query=${query}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full -mx-4.5 md:-mx-0 flex h-10 bg-blue-100 dark:bg-white/10 rounded-lg"
    >
      <select className="active:outline-fuchsia-500 w-14 rounded-tl-lg rounded-bl-lg px-1 lg:px-2">
        <option value="" className="dark:bg-gray-900">
          All
        </option>
        <option value="Men" className="dark:bg-gray-900">
          Men
        </option>
        <option value="Women" className="dark:bg-gray-900">
          Women
        </option>
        <option value="Kids" className="dark:bg-gray-900">
          Kids
        </option>
        <option value="Beauty" className="dark:bg-gray-900">
          Beauty
        </option>
        <option value="Electronics" className="dark:bg-gray-900">
          Electronics
        </option>
        <option value="Home-furniture" className="dark:bg-gray-900">
          Furniture
        </option>
        <option value="Grocery" className="dark:bg-gray-900">
          Grocery
        </option>
        <option value="Art-crafts" className="dark:bg-gray-900">
          Crafts
        </option>
        <option value="Books" className="dark:bg-gray-900">
          Books
        </option>
      </select>
      <input
        type="text"
        placeholder="Search for products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-1 md:px-2 lg:px-5 outline-0 border border-y-0 border-x-black/5 dark:border-x-white/5 focus:text-blue-800 dark:focus:text-blue-400"
      />
      <button
        type="submit"
        className="hover:scale-95 transition-transform py-1 pr-1.5 pl-1 lg:pr-3 lg:pl-2 rounded-tr-lg rounded-br-lg"
      >
        <Search size={20} />
      </button>
    </form>
  );
};

export default SearchBar;
