import Image from "next/image";
import Layout from "../components/layout";
import { NextApiRequest, NextApiResponse, NextPage } from "next";
import { useState, useEffect, FormEvent, SyntheticEvent } from "react";
import { Media } from "../models/media";
import { addMouseMoveEffectToCards } from "../utils/mouseOver";
import commonProps, { UserProps } from "../utils/commonProps";
import { UserList } from "../models/user";
import MediaCard from "../components/card";

export function getServerSideProps({ req, res }: { req: NextApiRequest, res: NextApiResponse }) {
  return commonProps({ req, res })
}

const Search: NextPage<UserProps> = ({ isLoggedIn, id }) => {
  const [inputValue, setInputValue] = useState("");
  const [searchResult, setSearchResult] = useState<Media[]>([]);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [addedToList, setAddedToList] = useState(false);
  const [lists, setLists] = useState<UserList[]>([]);
  const [state, changeState] = useState({
    listName: '',
    media: {}
  })

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

    const mediaInList = lists.some(list => list.items.some(m => m.id === mediaId));
    if (mediaInList) {
      setAddedToList(addedToList => !addedToList);
      console.log("Media already in list");
      return;
    }

  };


  const handleAddToListClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, state: { listName: string, media: Media }) => {
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
        else if (data.status === "erreur") {

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
  }

  const openSelectedStyle = (mediaId: number): React.CSSProperties => ({
    height: selectedMovieId === mediaId ? "360px" : "260px",
    width: selectedMovieId === mediaId ? "400px" : "300px",
    zIndex: selectedMovieId === mediaId ? 1 : 0,
    position: selectedMovieId === mediaId ? "fixed" : 'initial',
    top: selectedMovieId === mediaId ? "50%" : "auto",
    left: selectedMovieId === mediaId ? "50%" : "auto",
    transform:
      selectedMovieId === mediaId ? "translate(-50%, -50%)" : "translate(0)",
  });

  useEffect(() => {
    addMouseMoveEffectToCards("cards");
    fetchLists();
  }, []);

  return (
    <Layout isLoggedIn={isLoggedIn}>
      <div className="searchPageContainer">
        <form onSubmit={handleSubmit}>
          <h2>Enter movie or series</h2>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <div id="cards">
          {searchResult?.map((media: Media) => (
            <MediaCard 
              key={media.id}
              media={media}
              onClick={() => handleCardClick(media.id)}
              style={openSelectedStyle(media.id)}>
              {selectedMovieId === media.id && isLoggedIn && (
                <div>
                  <select onChange={(e) => changeState({ ...state, listName: e.target.value })}
                    id="lists" name="lists" required
                    onClick={(e) => handleSelect(e)}
                  >
                    {lists?.map((list) =>
                      <option
                        selected
                        key={list.name}
                        value={list.name}
                      >
                        {list.name}
                      </option>)}
                  </select>

                  <button
                    onClick={(e) => { handleAddToListClick(e, { ...state, media }) }}
                    style={{ backgroundColor: addedToList ? "green" : "" }}>
                    {addedToList ? "Added!" : "Add to list"}
                  </button>
                </div>
              )}
            </MediaCard>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Search;
