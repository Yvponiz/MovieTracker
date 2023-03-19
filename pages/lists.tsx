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
import MediaCard, { MediaCardContext } from '../components/card';
import Link from 'next/link';

export function getServerSideProps({ req, res }: { req: NextApiRequest, res: NextApiResponse }) {
  return commonProps({ req, res })
}

const List: NextPage<UserProps> = ({ isLoggedIn, id }) => {
  const [userLists, setUserLists] = useState<UserList[]>([]);
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [showCreateListDiv, setShowCreateListDiv] = useState(false);
  const [state, changeState] = useState({ listName: '', media: {} })
  const createListRef = useRef<HTMLDivElement>(null);
  const carousel = useRef(null);
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 500 : false;

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

  const handleRemoveFromList = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, state: { listName: string, media: Media }) => {
    e.stopPropagation();
    fetchLists();

    fetch(`/api/removeFromList?userId=${id}`,
      {
        body: JSON.stringify({
          listName: state.listName,
          media: JSON.stringify(state.media)
        }),
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
      }).catch((response) => response.json())
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setMessage(data.message.join("\n"));
          fetchLists();
        }
        else if (data.status === "error") {
          setShowMessage(!showMessage);
          setMessage(data.errors.join("\n"));
        }
      })
  };

  const handleCheckboxChange = (
    event: { target: { checked: boolean | ((prevState: boolean) => boolean); }; },
    state: { watched: boolean, media: Media, listName: string }
  ) => {
    fetch(`/api/updateWatched?userId=${id}`, {
      body: JSON.stringify(state),
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        fetchLists();
      })
  };

  useEffect(() => {
    fetchLists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
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

  const responsive = {
    0: { items: 2 },
    568: { items: 3 },
    1024: { items: 4 },
  };

  const ListItems = userLists?.map(userList => {
    const MediaItems = userList?.items.map(media => (
      <MediaCardContext.Provider key={media.id}
        value={{
          height: isMobile? 80 : 160,
          width: isMobile? 60 : 140,
          page: 'lists'
        }}
      >
        <MediaCard key={media.id} media={media}
          style={media.watched ? { border: 'solid 1.5px green' } : {}}
        >
          <button onClick={(e) => { handleRemoveFromList(e, { ...state, listName: userList.name, media }) }}> Delete</button>

          <input type='checkbox' checked={media.watched ? true : false}
            onChange={(e) => { handleCheckboxChange(e, { ...state, listName: userList.name, watched: e.target.checked, media }) }} />
        </MediaCard>
      </MediaCardContext.Provider>
    ));

    return (
      userLists ?
        <div className='list-div' key={userList.name}>
          <h2>{userList.name}</h2>
          <div className='list-carousel'>
            {userList.items.length > 0
              ?
              <AliceCarousel
                ref={carousel}
                items={MediaItems}
                responsive={responsive}
                mouseTracking
                animationDuration={800}
                paddingLeft={50}
                paddingRight={50}
                infinite
                disableDotsControls
              />
              :
              <div className='no-list'>
                <span>List empty</span>
                <Link href='/search'>Search</Link>
              </div>
            }
          </div>
        </div> : <span>You have no</span>
    );
  });

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
