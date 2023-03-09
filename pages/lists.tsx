import type { NextApiRequest, NextApiResponse, NextPage } from 'next'
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import AliceCarousel from 'react-alice-carousel';
import Layout from '../components/layout';
import { Media } from '../models/media';
import { addMouseMoveEffectToCards } from '../utils/mouseOver';
import commonProps, { UserProps } from '../utils/commonProps';

export function getServerSideProps({ req, res }: { req: NextApiRequest, res: NextApiResponse }) {
  return commonProps({ req, res })
}

const List: NextPage<UserProps> = ({isLoggedIn, id}) => {
  const [searchResult, setSearchResult] = useState<Media[]>([]);
  const [lists, setLists] = useState<Media[]>([]);
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [showCreateListDiv, setCreateListDiv] = useState(false);
  const carousel = useRef(null);
  
  useEffect(() => {
    addMouseMoveEffectToCards("cards");

    fetch(`/api/getLists?userId=${id}`)
    .then(response => response.json())
    .then(data => {
      if(data.status === 'empty'){
        console.log(data.messages)
        setShowMessage(!showMessage);
        setMessage(data.messages.join("\n"));
      }
      else if (data.status === 'success'){
        setLists(data.lists);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  
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

  const handleCreateList = () =>{
    setCreateListDiv(!showCreateListDiv);
  }

  return (
    <Layout isLoggedIn={isLoggedIn}>
      <div className='container'>
        <main>
          {showMessage ?
            <div className='no-list'>
              <p>{message}</p>
              <div className='submit-button' onClick={handleCreateList}>
                <button >Create List</button>
              </div>
            </div>: <></>
          }

          {showCreateListDiv ?
            <div className='create-list'>
              <form></form>  
            </div>
            :
            <></>
          }

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
