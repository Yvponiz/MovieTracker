import Image from "next/image";

export const SearchForm = ({ onSubmit, inputValue, setInputValue }: any): JSX.Element => {
  
  return (
    <form onSubmit={onSubmit}>
      <button type='submit' className="search-icon">
        <Image src='/icons/search.svg'
          height={30}
          width={30}
          alt='search icon' />
      </button>
      <input
        type="text"
        placeholder="Search"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)} />
    </form>
  );
};