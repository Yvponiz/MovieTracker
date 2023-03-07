import { NextPage } from "next";
import Image from "next/image";
import { useState, useEffect, FormEvent } from "react";
import { Media } from "../models/media";
import { addMouseMoveEffectToCards } from "../utils/mouseOver";
import Layout from "../component/layout";

const Search: NextPage = () => {
  const [inputValue, setInputValue] = useState("");
  const [searchResult, setSearchResult] = useState<Media[]>([]);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [addedToList, setAddedToList] = useState(false);

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
  };

  const handleAddToListClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, media: Media) => {
    e.stopPropagation();
  };

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
  }, []);

  return (
    <Layout>
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
            <div
              key={media.id}
              className="card"
              onClick={() => handleCardClick(media.id)}
              style={openSelectedStyle(media.id)}
            >
              <div className="card-content">
                {media.media_type === "movie" ? <h3>{media.title}</h3> : <h3>{media.name}</h3>}

                <Image
                  src={`https://www.themoviedb.org/t/p/original${media.poster_path}`}
                  height={200}
                  width={100}
                  alt={"media image"}
                />

                {media.media_type === "movie" ?
                  <p>{new Date(`${media.release_date}`).getFullYear()}</p>
                  : <p>{new Date(`${media.first_air_date}`).getFullYear()}</p>
                }

                {selectedMovieId === media.id && (
                  <button
                    onClick={(e) => { handleAddToListClick(e, media) }}
                    style={{ backgroundColor: addedToList ? "green" : "" }}>
                    {addedToList ? "Added!" : "Add to list"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Search;
