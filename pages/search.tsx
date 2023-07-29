import Layout from "../components/layout";
import { NextApiRequest, NextApiResponse, NextPage } from "next";
import { useState, useEffect, FormEvent, SyntheticEvent, useContext, useRef, FunctionComponent } from "react";
import commonProps, { UserProps } from "../utils/commonProps";
import { UserList } from "../models/user";
import { SearchForm } from "../components/searchForm";
import TrendingMovies from "../components/trendingMovies";
import PopularMovies from "../components/popularMovies";
import router from "next/router";
import { useSearch, SearchProvider } from "../context/searchContext";
import Trailers from "../components/trailers";

export function getServerSideProps({ req, res }: { req: NextApiRequest, res: NextApiResponse }) {
  return commonProps({ req, res })
}

const Search: FunctionComponent<UserProps> = ({ isLoggedIn, id, userType }) => {
  const [lists, setLists] = useState<UserList[]>([]);
  const [message, setMessage] = useState<string>('');
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [showMessageDiv, setShowMessageDiv] = useState<boolean>(false);
  const [blur, setBlur] = useState<boolean>(false);
  const { searchTerm, setSearchTerm } = useSearch();

  const fetchLists = () => {
    fetch(`/api/getLists?userId=${id}`)
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          setLists(data.lists);
        }
      });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    router.push(`/results?q=${searchTerm}`);
  };

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (selectedMovieId !== null) {
      setSelectedMovieId(null);
      setBlur(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchLists();
    }
    else {
      setShowMessageDiv(!showMessageDiv)
      setMessage("You must be logged in to add a movie or series to a list")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout isLoggedIn={isLoggedIn} userType={userType}>
      <div className="searchPageContainer">

        {blur && <div className="blur" onClick={handleOutsideClick}></div>}

        <SearchForm
          onSubmit={handleSubmit}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {!isLoggedIn && <p>{message}</p>}

        <TrendingMovies isLoggedIn={isLoggedIn} id={id} lists={lists} />
        <PopularMovies isLoggedIn={isLoggedIn} id={id} lists={lists} />
        <Trailers />
      </div>
    </Layout>
  );
};

const SearchPage: NextPage<UserProps> = (props) => {
  return (
    <Search {...props} />
  );
};

export default SearchPage;
