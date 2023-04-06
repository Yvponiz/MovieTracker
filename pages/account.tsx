import { NextApiRequest, NextApiResponse, NextPage } from "next";
import Layout from "../components/layout";
import commonProps, { UserProps } from "../utils/commonProps";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { UserList } from "../models/user";
import Image from "next/image";
import Router from "next/router";

export function getServerSideProps({ req, res }: { req: NextApiRequest, res: NextApiResponse }) {
    return commonProps({ req, res })
}

const Account: NextPage<UserProps> = ({ isLoggedIn, id, username, email }) => {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [userLists, setUserLists] = useState<UserList[]>([]);
    const [state, changeState] = useState({
        username: username,
        newUsername: '',
        email: email,
        newEmail: '',
        password: '',
        newPassword: '',
        confPassword: ''
    })
    const router = Router;

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

    useEffect(() => {
        fetchLists();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleActive = (index: number) => {
        setActiveIndex(index);
    }

    function handleProfileChanges(event: FormEvent) {
        event.preventDefault();
        fetch("/api/updateProfile",
            {
                body: JSON.stringify(state),
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
            }).catch((response) => response.json())
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    router.push('/account')
                }
                else if (data.status === "error") {

                }
            })
    }

    function handlePasswordChange(event: FormEvent) {
        event.preventDefault();
        fetch("/api/changePassword",
            {
                body: JSON.stringify(state),
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
            }).catch((response) => response.json())
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {

                }
                else if (data.status === "error") {

                }
            })
    }

    return (
        <Layout isLoggedIn={isLoggedIn}>
            <main>
                <div className="account-wrapper">
                    <div>
                        <h1>Account</h1>
                        <p>Set your account settings down below</p>
                    </div>

                    <div className="account-sections-button">
                        <ul>
                            <li
                                className={activeIndex === 0 ? 'active' : ''}
                                onClick={() => handleActive(0)}
                            >
                                Profile
                            </li>
                            <li
                                className={activeIndex === 1 ? 'active' : ''}
                                onClick={() => handleActive(1)}
                            >
                                Password
                            </li>
                            <li
                                className={activeIndex === 2 ? 'active' : ''}
                                onClick={() => handleActive(2)}
                            >
                                Lists
                            </li>
                        </ul>
                    </div>

                    <div className="account-sections">

                        {activeIndex === 0 &&
                            <form>
                                <div className="account-sections-field">
                                    <label htmlFor="username">Username</label>
                                    <input
                                        disabled
                                        type="text" id="username" name="username" placeholder={username}
                                    />
                                </div>
                                <div className="account-sections-field">
                                    <label htmlFor="newUsername">New Username</label>
                                    <input
                                        onChange={(event) => changeState({ ...state, newUsername: event.target.value })}
                                        type="text" id="newUsername" name="newUsername"
                                    />
                                </div>

                                <div className="account-sections-field">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        disabled type="text" id="email" name="email" placeholder={email}
                                    />
                                </div>

                                <div className="account-sections-field">
                                    <label htmlFor="newEmail">New Email</label>
                                    <input
                                        onChange={(event) => changeState({ ...state, newEmail: event.target.value })}
                                        type="text" id="newEmail" name="newEmail"
                                    />
                                </div>

                                <button onClick={(event) => handleProfileChanges(event)}>Save Changes</button>
                            </form>
                        }

                        {activeIndex === 1 &&
                            <form>
                                <div className="account-sections-field">
                                    <label htmlFor="password">Password</label>
                                    <input
                                        onChange={(event) => changeState({ ...state, password: event.target.value })}
                                        type="password" id="password" name="password"
                                    />
                                </div>

                                <div className="account-sections-field">
                                    <label htmlFor="newPassword">New Password</label>
                                    <input
                                        onChange={(event) => changeState({ ...state, newPassword: event.target.value })}
                                        type="password" id="password" name="password"
                                    />
                                </div>

                                <div className="account-sections-field">
                                    <label htmlFor="password">Confirm Password</label>
                                    <input
                                        onChange={(event) => changeState({ ...state, confPassword: event.target.value })}
                                        type="password" id="conf-password" name="conf-password"
                                    />
                                </div>

                                <button onClick={(event) => handlePasswordChange(event)}>Change password</button>
                            </form>
                        }

                        {activeIndex === 2 &&
                            <ul>
                                {showMessage ? message :
                                    userLists?.map((list) => (
                                        <li key={list.name}>
                                            {list.name}
                                            <select name="lists" id="lilsts">
                                                {list?.items.length === 0 ?
                                                    <option> No items</option>
                                                    :
                                                    list?.items?.map((item) => (
                                                        <option key={item.id}>{item.name}</option>
                                                    ))
                                                }
                                            </select>
                                            <Image
                                                src={"/icons/delete-icon.svg"}
                                                height={30}
                                                width={30}
                                                alt={"delete icon"} />
                                        </li>
                                    ))}
                            </ul>
                        }
                    </div>
                </div>
            </main>
        </Layout >
    )
}

export default Account