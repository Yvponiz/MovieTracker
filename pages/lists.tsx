import type { NextApiRequest, NextApiResponse, NextPage } from 'next'
import Image from 'next/image';
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";
import Layout from '../components/layout';
import { Media } from '../models/media';
import { UserList } from '../models/user';
import { addMouseMoveEffectToCards } from '../utils/mouseOver';
import commonProps, { UserProps } from '../utils/commonProps';
import MediaCard from '../components/card';

export function getServerSideProps({ req, res }: { req: NextApiRequest, res: NextApiResponse }) {
  return commonProps({ req, res })
}

const List: NextPage<UserProps> = ({ isLoggedIn, id }) => {
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [userLists, setUserLists] = useState<UserList[]>([]);
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [showCreateListDiv, setShowCreateListDiv] = useState(false);
  const [state, changeState] = useState({ listName: '' })
  const createListRef = useRef<HTMLDivElement>(null);
  const carousel = useRef(null);

  const fetchLists = useCallback(() => {
    fetch(`/api/getLists?userId=${id}`)
      .then(response => response.json())
      .then(data => {
        if (data.status === 'empty') {
          console.log(data.messages)
          setShowMessage(!showMessage);
          setMessage(data.messages.join("\n"));
        }
        else if (data.status === 'success') {
          setUserLists(data.lists as UserList[]);
        }
      });
  }, [id, showMessage]);

  const handleShowCreateList = useCallback(() => {
    setShowCreateListDiv(showCreateListDiv => !showCreateListDiv);
  }, []);


  const handleCreateList = useCallback((event: FormEvent, state: { listName: string }) => {
    event.preventDefault()
    fetch(`/api/createList?userId=${id}`, {
      body: JSON.stringify(state),
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
    }).catch((response) => response.json())
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          if (showMessage) { setShowMessage(!showMessage) }
          setMessage(data.message);
          setShowCreateListDiv(false);
          fetchLists();
        }
      })
  }, [fetchLists, id, showMessage]);

  useEffect(() => {
    fetchLists();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    addMouseMoveEffectToCards("cards");
    setMediaList(userLists.flatMap((list) => list.items) as Media[]);
    const handleClickOutside = (event: MouseEvent) => {
      if (createListRef.current && !createListRef.current.contains(event.target as Node)) {
        setShowCreateListDiv(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [createListRef, userLists]);

  const ListItems = userLists?.map(userList => {
    const MediaItems = userList?.items.map(media => (
      <MediaCard key={media.id} media={media} />
    ));
    
    return (
      <div className='list-div' key={userList.name}>
        <h3>{userList.name}</h3>
        <div className='list-carousel'>
          <AliceCarousel
            ref={carousel}
            items={MediaItems}
            mouseTracking
            animationDuration={800}
            paddingLeft={50}
            paddingRight={50}
            infinite
            disableDotsControls
          />
        </div>
      </div>
    );
  });
  

  const responsive = {
    0: { items: 2 },
    568: { items: 3 },
    1024: { items: 4 },
  };

  /*const ImageRows = [];
  for (let i = 0; i < ImageItems.length; i += 2) {
    ImageRows.push(ImageItems.slice(i, i + 2));
  }*/

  /*const ImageRows = useMemo(() => {
  const rows = [];
  for (let i = 0; i < ImageItems.length; i += 2) {
    rows.push(ImageItems.slice(i, i + 2));
  }
  return rows;
}, [ImageItems]);*/

  return (
    <Layout isLoggedIn={isLoggedIn}>
      <div className='list-page-wrapper'>
        {showMessage
          ? <div className='no-list'>
            <p>{message}</p>
            <div className='submit-button' onClick={handleShowCreateList}>
              <button className='list-button'>Create List</button>
            </div>
          </div>
          : <div className='list-page'>
            <div className='submit-button' onClick={handleShowCreateList}>
              <button className='list-button'>Create List</button>
            </div>
            {ListItems}

          </div>
        }
        {showCreateListDiv ?
          <div className='create-list' ref={createListRef} >
            <form>
              <label htmlFor="list-name">List name: </label>
              <input onChange={(event) => changeState({ ...state, listName: event.target.value })} type="text" name="list-name" id="list-name" required />
              <button onClick={(event) => handleCreateList(event, state)}>Create</button>
            </form>
          </div>
          :
          <></>
        }
      </div>
    </Layout>
  )
}

export default List
