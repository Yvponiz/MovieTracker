import type { NextPage } from 'next'
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import AliceCarousel from 'react-alice-carousel';
import Layout from '../components/layout';
import { Media } from '../models/media';
import { addMouseMoveEffectToCards } from '../utils/mouseOver';

const List: NextPage = () => {
  const [searchResult, setSearchResult] = useState<Media[]>([]);
  const carousel = useRef(null);

  const ImageItems = searchResult?.map((movie: Media) => (
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

  useEffect(() => {
    addMouseMoveEffectToCards("cards");
  }, []);

  return (
    <Layout>
      <div className='container'>
        <main>
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
        </main>
      </div>
    </Layout>
  )
}

export default List
