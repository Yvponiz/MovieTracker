import Image from "next/image";

export const SearchForm = ({ onSubmit, searchTerm, setSearchTerm }: any): JSX.Element => {
  
  return (
    <form onSubmit={onSubmit} className='search-form'>
      <button type='submit' className="search-icon">
        <Image src='/icons/search.svg'
          height={30}
          width={30}
          alt='search icon' />
      </button>
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} />
    </form>
  );
};