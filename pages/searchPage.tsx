import { NextPage } from "next";
import Image from 'next/image'
import { useState, useEffect, FormEvent, useRef } from "react";
import { Movie } from "../models/media";
import { addMouseMoveEffectToCards } from "../utils/mouseOver";
import AliceCarousel from "react-alice-carousel";
import 'react-alice-carousel/lib/alice-carousel.css';
import Layout from "../component/layout";

const Search: NextPage = () => {
  const [inputValue, setInputValue] = useState("");
  const [searchResult, setSearchResult] = useState<Movie[]>([]);
  const carousel = useRef(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    fetch(`/api/search?q=${inputValue}`)
      .then((res) => res.json())
      .then((data) => setSearchResult(data.results as Movie[]));
  };

  const ImageItems = searchResult?.map((movie: Movie) => (
    <div key={movie.id} className="card">
      <div className="card-content">
        <p>{movie.title}</p>
        <Image
          src={`https://www.themoviedb.org/t/p/original${movie.poster_path}`}
          height={200}
          width={100}
          alt={"media image"}
        ></Image>
        <p>{new Date(`${movie.release_date}`).getFullYear()}</p>
      </div>
    </div>
  ));

  const responsive = {
    0: { items: 2 },
    568: { items: 3 },
    1024: { items: 4 },
  };


  /*const ImageRows = [];
  for (let i = 0; i < ImageItems.length; i += 2) {
    ImageRows.push(ImageItems.slice(i, i + 2));
  }*/

  addMouseMoveEffectToCards("cards");

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

        <div id="carousel">
          <AliceCarousel
            ref={carousel}
            items={ImageItems}
            responsive={responsive}
            infinite
            mouseTracking
            animationDuration={800}
            paddingLeft={50}
            paddingRight={50}
            disableDotsControls
          />
        </div>

        {/* <div id="cards">
          {searchResult?.map((movie: Movie) => (
            <div key={movie.id} className="card">
              <div className="card-content">
                <p>{movie.title}</p>
                <Image
                  src={`https://www.themoviedb.org/t/p/original${movie.poster_path}`}
                  //src={`/placeholder.png`}
                  height={200}
                  width={100}
                  alt={"media image"}
                ></Image>
                <img
                  src={`https://www.themoviedb.org/t/p/original${movie.poster_path}`}
                  alt=""
                  height={200}
                  width={100}
                />
                <p>{new Date(`${movie.release_date}`).getFullYear()}</p>
              </div>
            </div>
          ))}
        </div> */}
      </div>
    </Layout>
  );
};

export default Search;
