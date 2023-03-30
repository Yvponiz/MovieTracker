import { NextApiRequest, NextApiResponse, NextPage } from "next";
import { useRouter } from "next/router";
import { FormEvent, SyntheticEvent, useEffect, useState } from "react";
import { Credits, Media } from "../models/media";
import Layout from "../components/layout";
import MediaCard from "../components/card";
import { UserList } from "../models/user";
import commonProps, { UserProps } from "../utils/commonProps";
import { SearchForm } from "../components/searchForm";

export function getServerSideProps({ req, res }: { req: NextApiRequest, res: NextApiResponse }) {
    return commonProps({ req, res })
}

const Results: NextPage<UserProps> = ({ isLoggedIn, id }) => {
    const router = useRouter();
    const searchTerm = router.query.q;
    const [searchResults, setSearchResults] = useState<Media[]>([]);
    const [creditResults, setCreditResults] = useState<Credits[]>([])
    const [lists, setLists] = useState<UserList[]>([]);
    const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
    const [state, changeState] = useState({ listName: '', media: {} })
    const [addedToList, setAddedToList] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [inputValue, setInputValue] = useState<string>("");
    const [showMessageDiv, setShowMessageDiv] = useState<boolean>(false);
    const [blur, setBlur] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (searchTerm) {
            fetch(`/api/searchMedia?q=${searchTerm}`)
                .then((res) => res.json())
                .then((data) => {
                    setSearchResults(data.results as Media[]);
                    setCreditResults(data.credits as Credits[]);
                    setIsLoading(false);
                });
        }
    }, [searchTerm]);

    const fetchLists = () => {
        fetch(`/api/getLists?userId=${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    setLists(data.lists);
                }
            });
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

    const handleSelect = (e: SyntheticEvent<HTMLSelectElement, Event>) => {
        e.stopPropagation();
        const { value } = e.currentTarget;
        changeState((prevState) => ({
            ...prevState,
            listName: value,
        }));
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

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        router.push(`/results?q=${inputValue}`);
    };

    return (
        <Layout>
            <div className="search-results-page">
                {blur && <div className="blur" onClick={handleOutsideClick}></div>}

                <SearchForm
                    onSubmit={handleSubmit}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                />

                <h2>Search Results for `{searchTerm}`</h2>

                <div className="search-result-div">
                    {searchResults?.map((media: Media) => (
                        <MediaCard
                            key={media.id}
                            media={media}
                            credits={creditResults}
                            className={`search-card${selectedMovieId === media.id ? " expanded-search-card" : ""}`}
                            onClick={() => handleCardClick(media.id)}
                            selectedMovieId={selectedMovieId}
                            isLoading={isLoading}
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

                                        <button
                                            onClick={(e) => { handleAddToListClick(e, { ...state, media }) }}
                                            style={{ backgroundColor: addedToList ? "green" : "" }}
                                        >
                                            {addedToList ? "Added!" : "Add to list"}
                                        </button>

                                    </div>
                                </div>
                            )}
                        </MediaCard>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default Results;
