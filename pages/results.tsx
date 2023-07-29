import { NextApiRequest, NextApiResponse, NextPage } from "next";
import { FormEvent, useEffect, useState } from "react";
import { Credits, Media } from "../models/media";
import Layout from "../components/layout";
import MediaCard from "../components/card";
import { UserList } from "../models/user";
import commonProps, { UserProps } from "../utils/commonProps";
import { SearchForm } from "../components/searchForm";
import { useSearch } from "../context/searchContext";
import AddButton from '../components/addButton';

export function getServerSideProps({ req, res }: { req: NextApiRequest, res: NextApiResponse }) {
    return commonProps({ req, res })
}

const Results: NextPage<UserProps> = ({ isLoggedIn, id, userType }) => {
    const [searchResults, setSearchResults] = useState<Media[]>([]);
    const [creditResults, setCreditResults] = useState<Credits[]>([])
    const [lists, setLists] = useState<UserList[]>([]);
    const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
    const [clickedButton, setClickedButton] = useState<number | null>(null);
    const [showMessageDiv, setShowMessageDiv] = useState<boolean>(false);
    const [blur, setBlur] = useState<boolean>(false);

    const { searchTerm, setSearchTerm, isLoading, setIsLoading } = useSearch();

    const fetchLists = () => {
        fetch(`/api/getLists?userId=${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    setLists(data.lists);
                }
            });
    };

    useEffect(() => {
        if (isLoggedIn) {
            fetchLists();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
    }, [searchTerm, setIsLoading]);

    const handleCardClick = (mediaId: number) => {
        setSelectedMovieId((prevSelectedMovieId) =>
            prevSelectedMovieId === mediaId ? null : mediaId
        );
        setBlur((prevBlur) => !prevBlur);
    };

    const handleButtonClick = (e: React.MouseEvent, mediaId: number) => {
        e.stopPropagation();
        setClickedButton((prevClickedButton) => (prevClickedButton === mediaId ? null : mediaId));
    };

    const handleOutsideClick = (e: React.MouseEvent) => {
        if (selectedMovieId !== null) {
            setSelectedMovieId(null);
            setBlur(false);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setSearchTerm(searchTerm);
    };


    return (
        <Layout isLoggedIn={isLoggedIn} userType={userType}>
            <div className="search-results-page">
                {blur && <div className="blur" onClick={handleOutsideClick}></div>}

                <SearchForm
                    onSubmit={handleSubmit}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
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
                            {isLoggedIn &&
                                <div
                                    className={`results-card-button add-button${clickedButton === media.id ? " expanded-add-button" : ""}`}
                                    onClick={(e) => { handleButtonClick(e, media.id) }}
                                >
                                    <AddButton
                                        id={id}
                                        media={media}
                                        imgHeight={30}
                                        imgWidth={30}
                                        lists={lists}
                                        clickedButton={clickedButton}
                                    />
                                </div>
                            }
                        </MediaCard>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default Results;
