import Image from "next/image";
import Layout from "../components/layout";
import { NextApiRequest, NextApiResponse, NextPage } from "next";
import { useState, useEffect, FormEvent, SyntheticEvent, useContext } from "react";
import { Media } from "../models/media";
import { addMouseMoveEffectToCards } from "../utils/mouseOver";
import commonProps, { UserProps } from "../utils/commonProps";
import { UserList } from "../models/user";
import MediaCard, { MediaCardContext } from "../components/card";
import { openSelectedStyle } from "../styles/selectedCardStyle";
import { SearchForm } from "../components/searchForm";
import TrendingMovies from "../components/trendingMovies";

export function getServerSideProps({ req, res }: { req: NextApiRequest, res: NextApiResponse }) {
  return commonProps({ req, res })
}

const Search: NextPage<UserProps> = ({ isLoggedIn, id }) => {
  const [searchResult, setSearchResult] = useState<Media[]>([]);
  const [lists, setLists] = useState<UserList[]>([]);
  const [state, changeState] = useState({ listName: '', media: {} })
  const [inputValue, setInputValue] = useState<string>("");
  const [message, setMessage] = useState<string>('');
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState<number | null>(null);
  const [addedToList, setAddedToList] = useState<boolean>(false);
  const [showMessageDiv, setShowMessageDiv] = useState<boolean>(false);
  const [blur, setBlur] = useState<boolean>(false);
  const [mediaInfo, setMediaInfo] = useState<boolean>(false);

  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 500 : false;
  const styleParams = { isMobile: isMobile, selectedMovieId };

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
    fetch(`/api/searchMedia?q=${inputValue}`)
      .then((res) => res.json())
      .then((data) => setSearchResult(data.results as Media[]));
  };

  const handleCardClick = (mediaId: number) => {
    setSelectedMovieId((prevSelectedMovieId) =>
      prevSelectedMovieId === mediaId ? null : mediaId
    );
    setBlur((prevBlur) => !prevBlur);

    const firstListName = lists[0]?.name || '';
    changeState({ listName: firstListName, media: {} });
    setAddedToList(false);
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
          inputValue={inputValue}
          setInputValue={setInputValue}
        />

        {!isLoggedIn && <p>{message}</p>}

        <h2>Trending movies & series</h2>
        <TrendingMovies isLoggedIn={isLoggedIn} />

        <h2>Search results</h2>
        <div className="search-result-div">
          {searchResult?.map((media: Media) => (
            <>
              <MediaCardContext.Provider
                value={{
                  height: isMobile ? 170 : selectedMovieId === media.id ? 400 : 160,
                  width: isMobile ? 130 : selectedMovieId === media.id ? 380 : 140,
                  page: 'search'
                }}
              >
                <MediaCard
                  key={media.id}
                  media={media}
                  className='search-card'
                  onClick={() => handleCardClick(media.id)}
                  onMouseEnter={() => setIsHovered(media.id)}
                  onMouseLeave={() => setIsHovered(null)}
                  style={openSelectedStyle(styleParams, media)}
                  setMediaInfo={setMediaInfo}
                  selectedMovieId={selectedMovieId}
                  isLoggedIn={isLoggedIn}
                >
                  {selectedMovieId === media.id && isLoggedIn && (
                    <div id="add-to-list">
                      <div>
                        <select onChange={(e) => changeState({ ...state, listName: e.target.value })}
                          id="lists" name="lists" required
                          onClick={(e) => handleSelect(e)}
                        >
                          {lists.length === 0 ?
                            <option>No Lists</option>
                            :
                            lists?.map((list) =>
                              <option
                                key={list.name}
                                value={list.name}
                              >
                                {list.name}
                              </option>
                            )
                          }
                        </select>

                        {isLoggedIn && <div className="search-card-content-right"
                          onClick={(e) => { handleAddToListClick(e, { ...state, media }) }}
                          style={{ backgroundColor: addedToList ? "green" : "" }}>

                          {addedToList ? "Added!" : "Add to list"}
                        </div>}

                      </div>

                      {/*If there is an error adding to the list*/}
                      <div className="list-message">
                        {showMessageDiv ? <span>{message}</span> : <></>}
                      </div>
                    </div>
                  )}

                  {mediaInfo && selectedMovieId === media.id && (
                    <div className="info-text">
                      {media.overview ? <p>{media.overview}</p> : <p>{`Aye man, I couldn't find no summary`}</p>}
                    </div>
                  )}

                </MediaCard>
              </MediaCardContext.Provider>
            </>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Search;
