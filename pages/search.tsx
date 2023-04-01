import Layout from "../components/layout";
import { NextApiRequest, NextApiResponse, NextPage } from "next";
import { useState, useEffect, FormEvent, SyntheticEvent, useContext, useRef, FunctionComponent } from "react";
import { Media } from "../models/media";
import commonProps, { UserProps } from "../utils/commonProps";
import { UserList } from "../models/user";
import { SearchForm } from "../components/searchForm";
import TrendingMovies from "../components/trendingMovies";
import PopularMovies from "../components/popularMovies";
import router from "next/router";
import { useSearch, SearchProvider  } from "../context/searchContext";
import Trailers from "../components/trailers";

export function getServerSideProps({ req, res }: { req: NextApiRequest, res: NextApiResponse }) {
  return commonProps({ req, res })
}

const Search: FunctionComponent<UserProps> = ({ isLoggedIn, id }) => {
  const [lists, setLists] = useState<UserList[]>([]);
  const [state, changeState] = useState({ listName: '', media: {} })
  const [message, setMessage] = useState<string>('');
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [addedToList, setAddedToList] = useState<boolean>(false);
  const [showMessageDiv, setShowMessageDiv] = useState<boolean>(false);
  const [blur, setBlur] = useState<boolean>(false);
  const { searchTerm, setSearchTerm, isLoading, setIsLoading } = useSearch();


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
    setIsLoading(true);
    router.push(`/results?q=${searchTerm}`);
  };

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (selectedMovieId !== null) {
      setSelectedMovieId(null);
      setBlur(false);
    }
  };

  const handleAddToListClick = (e: React.MouseEvent, state: { listName: string, media: Media }) => {
    e.stopPropagation();
    fetchLists();

    fetch(`/api/addToList?userId=${id}`,
      {
        body: JSON.stringify({
          listName: state.listName,
          media: state.media
        }),
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
      }).catch((response) => response.json())
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setAddedToList(addedToList => !addedToList);
        }
        else if (data.status === "error") {
          setShowMessageDiv(!showMessageDiv);
          setMessage(data.errors.join("\n"));
          setTimeout(() => {
            setShowMessageDiv(!showMessageDiv);
            setMessage('');
          }, 1000);
        }
      })
  };

  const handleSelect = (e: SyntheticEvent<HTMLSelectElement, Event>) => {
    e.stopPropagation();
    const { value } = e.currentTarget;
    changeState((prevState) => ({
      ...prevState,
      listName: value,
    }));
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
    <Layout isLoggedIn={isLoggedIn}>
      <div className="searchPageContainer">

        {blur && <div className="blur" onClick={handleOutsideClick}></div>}

        <SearchForm
          onSubmit={handleSubmit}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {!isLoggedIn && <p>{message}</p>}

        <TrendingMovies isLoggedIn={isLoggedIn} lists={lists} />
        <PopularMovies isLoggedIn={isLoggedIn} lists={lists} />
        <Trailers/>
      </div>
    </Layout>
  );
};

const SearchPage: NextPage<UserProps> = (props) => {
  return (
    <SearchProvider>
      <Search {...props} />
    </SearchProvider>
  );
};

export default SearchPage;
