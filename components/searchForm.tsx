export const SearchForm = ({ onSubmit, inputValue, setInputValue }: any): JSX.Element => {
    return (
      <form onSubmit={onSubmit}>
        <h2>Enter movie or series</h2>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)} />
        <button type="submit">Search</button>
      </form>
    );
  };