import type { NextApiRequest, NextApiResponse, NextPage } from 'next'
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";
import Layout from '../components/layout';
import { Media } from '../models/media';
import { UserList } from '../models/user';
import commonProps, { UserProps } from '../utils/commonProps';
import MediaCard from '../components/card';
import Link from 'next/link';
import { listCardSelectedStyle } from '../styles/selectedCardStyle';
import { SearchForm } from '../components/searchForm';
import router from 'next/router';
import { useSearch } from '../context/searchContext';

export function getServerSideProps({ req, res }: { req: NextApiRequest, res: NextApiResponse }) {
  return commonProps({ req, res })
}

const List: NextPage<UserProps> = ({ isLoggedIn, id }) => {
  const [userLists, setUserLists] = useState<UserList[]>([]);
  const [state, changeState] = useState({ listName: '', media: {} })
  const [message, setMessage] = useState<string>('');
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [showCreateListDiv, setShowCreateListDiv] = useState<boolean>(false);
  const [listTitleClick, setListTitleClick] = useState<boolean>(false);
  const [mediaInfo, setMediaInfo] = useState<boolean>(false);
  const [mediaWatchedStatus, setMediaWatchedStatus] = useState<Record<number, boolean>>({});

  const { searchTerm, setSearchTerm, isLoading, setIsLoading } = useSearch();

  const [blur, setBlur] = useState<boolean>(false);
  const createListRef = useRef<HTMLDivElement>(null);
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
    setShowMessage(false);
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
          setShowMessage(!showMessage)
          setMessage(data.message);
          setShowCreateListDiv(false);
          fetchLists();
        }
        else if (data.status === "error") {
          setShowMessage(!showMessage)
          setMessage(data.errors.join("\n"));
        }
      })
  }, [fetchLists, id, showMessage]);

  const handleDeleteList = useCallback((state: { listName: string }) => {
    fetch(`/api/deleteList?userId=${id}`, {
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
  }, [fetchLists, id, showMessage])

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
    watched: boolean,
    media: Media,
    listName: string
  ) => {
    const updateData = {
      watched,
      media,
      listName
    };

    fetch(`/api/updateWatched?userId=${id}`, {
      body: JSON.stringify(updateData),
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

  const handleTitleClick = (e: React.MouseEvent) => (
    setListTitleClick(listTitleClick => !listTitleClick)
  )

  const handleCardClick = (mediaId: number) => {
    setSelectedMovieId((prevSelectedMovieId) =>
      prevSelectedMovieId === mediaId ? null : mediaId
    );
    setBlur((prevBlur) => !prevBlur);
  };

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (selectedMovieId !== null) {
      setSelectedMovieId(null);
      setBlur(false);
    }
  };

  const handleCheckClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    router.push(`/results?q=${searchTerm}`);
};

  useEffect(() => {
    if (isLoggedIn) {
      fetchLists();
    }
    else {
      setShowMessage(!showMessage);
      setMessage("You must be logged in to create and view lists")
    }
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

  return (
    <Layout isLoggedIn={isLoggedIn}>
      {blur && <div className="blur" onClick={handleOutsideClick}></div>}

      <div className='list-page-wrapper'>
        {!isLoggedIn ? <p>{message}</p>
          :
          <div className='list-page'>

            {userLists.length === 0 &&
              <div className='no-list'>
                <p>{message}</p>
              </div>
            }

            <div className='submit-button' onClick={handleShowCreateList}>
              <button className='list-button'>Create List</button>
            </div>

            <SearchForm
              onSubmit={handleSubmit}
              inputValue={searchTerm}
              setInputValue={searchTerm}
            />

            {userLists.map((userList) => (
              <div className='list-div' key={userList.name}>
                <div className='list-name' title='Click to delete list!' onClick={(e) => handleTitleClick(e)}>
                  <h2>{userList.name}</h2>
                  {listTitleClick &&
                    <button
                      onClick={() => handleDeleteList({ listName: userList.name })}
                      title='Delete list'
                    >X </button>}
                  {userList.items.length === 0 &&
                    <div className='no-list'>
                      <span>List empty</span>
                    </div>
                  }
                </div>

                <div className='list-div-items'>
                  {userList.items.length > 0 && (
                    userList.items.map(media => (
                      <MediaCard key={media.id} media={media}
                        style={listCardSelectedStyle({ isMobile: isMobile, selectedMovieId, watched: media.watched }, media.id)}
                        onClick={() => handleCardClick(media.id)}
                        setMediaInfo={setMediaInfo}
                        selectedMovieId={selectedMovieId}
                        className={`search-card${selectedMovieId === media.id ? " expanded-search-card" : ""}`}
                        isLoggedIn={isLoggedIn}
                      >
                        {selectedMovieId === media.id &&
                          <button
                            onClick={(e) => { handleRemoveFromList(e, { ...state, listName: userList.name, media }) }}
                            className='remove-list-button'
                          >
                            Remove
                          </button>
                        }

                        <input
                          type="checkbox"
                          checked={mediaWatchedStatus.hasOwnProperty(media.id) ? mediaWatchedStatus[media.id] : media.watched}
                          onChange={(e) => { handleCheckboxChange(e, e.target.checked, media, userList.name); }}
                          onClick={(e) => { handleCheckClick(e); }}
                        />

                        {mediaInfo && selectedMovieId === media.id && (
                          <div className="info-text">
                            {media.overview ? <p>{media.overview}</p> : <p>{`Aye man, I couldn't find no summary`}</p>}
                          </div>
                        )}

                      </MediaCard>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>}

        {showCreateListDiv &&
          <div className='create-list' ref={createListRef} >
            <form>
              <label htmlFor="list-name">List name: </label>
              <input onChange={(event) => changeState({ ...state, listName: event.target.value })} type="text" name="list-name" id="list-name" required />
              <button onClick={(event) => handleCreateList(event, state)}>Create</button>
            </form>

            {showMessage && <p className='error'>{message}</p>}
          </div>
        }
      </div>
    </Layout>
  )
}

export default List
