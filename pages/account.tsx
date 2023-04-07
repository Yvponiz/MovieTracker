import { NextApiRequest, NextApiResponse, NextPage } from "next";
import Layout from "../components/layout";
import commonProps, { UserProps } from "../utils/commonProps";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { UserList } from "../models/user";
import Image from "next/image";
import { useRouter } from "next/router";

export function getServerSideProps({ req, res }: { req: NextApiRequest, res: NextApiResponse }) {
    return commonProps({ req, res })
}

const Account: NextPage<UserProps> = ({ isLoggedIn, id, username, email }) => {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const [showListMessage, setShowListMessage] = useState<boolean>(false);
    const [passwordMessage, setPasswordMessage] = useState<string>('');
    const [listsMessage, setListsMessage] = useState<string>('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');
    const [userLists, setUserLists] = useState<UserList[]>([]);
    const [state, changeState] = useState({
        username: username,
        newUsername: '',
        email: email,
        newEmail: '',
        confEmail: '',
        password: '',
        newPassword: '',
        confPassword: ''
    })
    const router = useRouter();

    const fetchLists = useCallback(() => {
        fetch(`/api/getLists?userId=${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'empty') {
                    console.log(data.messages)
                    setShowListMessage(true);
                    setListsMessage(data.messages.join("\n"));
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
        setShowMessage(false)
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
                    changeState({ ...state, newEmail: '', confEmail: '', newUsername: '' });
                    setShowError(false);
                }
                else if (data.status === "error") {
                    setShowError(true);
                    setError(data.errors.join('\n'));
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
                    setShowError(false)
                    setShowMessage(true);
                    changeState({ ...state, password: '', newPassword: '', confPassword: '' });
                    setPasswordMessage('Password Changed');
                }
                else if (data.status === "error") {
                    setShowMessage(false);
                    setShowError(true);
                    setError(data.errors.join('\n'));
                }
            })
    }

    function handleDeleteList(state: { listId: string }) {
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
                    fetchLists();
                }
            })
    }

    function handleDeleteAccount() {
        setShowConfirmationDialog(true);
        { console.log(showConfirmationDialog) }
    }

    function handleConfirmDelete() {
        fetch(`/api/deleteAccount?user=${username}`)
            .then((res) => {
                if (res.ok) {
                    router.push('/api/logout');
                } else {
                    // Handle the error
                }
            });

        setShowConfirmationDialog(false);
    }

    const ConfirmationDialog = () => {
        return (
            <div className="confirmation-dialog">
                <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                <div>
                    <button onClick={handleConfirmDelete}>Yes, delete my account</button>
                    <button onClick={() => setShowConfirmationDialog(false)}>Cancel</button>
                </div>
            </div>
        );
    };

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
                                    <label htmlFor="newUsername">New username</label>
                                    <input
                                        onChange={(event) => changeState({ ...state, newUsername: event.target.value })}
                                        type="text" id="newUsername" name="newUsername" value={state.newUsername}
                                    />
                                </div>

                                <div className="account-sections-field">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        disabled type="text" id="email" name="email" placeholder={email}
                                    />
                                </div>

                                <div className="account-sections-field">
                                    <label htmlFor="newEmail">New email</label>
                                    <input
                                        onChange={(event) => changeState({ ...state, newEmail: event.target.value })}
                                        type="text" id="newEmail" name="newEmail" value={state.newEmail}
                                    />
                                </div>

                                <div className="account-sections-field">
                                    <label htmlFor="confEmail">Confirm new email</label>
                                    <input
                                        onChange={(event) => changeState({ ...state, confEmail: event.target.value })}
                                        type="text" id="confEmail" name="confEmail" value={state.confEmail}
                                    />
                                </div>

                                <button onClick={(event) => handleProfileChanges(event)}>Save Changes</button>

                                {showError && <p className="error">{error}</p>}
                            </form>
                        }

                        {activeIndex === 1 &&
                            <form>
                                <div className="account-sections-field">
                                    <label htmlFor="password">Password</label>
                                    <input
                                        onChange={(event) => changeState({ ...state, password: event.target.value })}
                                        type="password" id="password" name="password" value={state.password}
                                    />
                                </div>

                                <div className="account-sections-field">
                                    <label htmlFor="newPassword">New Password</label>
                                    <input
                                        onChange={(event) => changeState({ ...state, newPassword: event.target.value })}
                                        type="password" id="newPassword" name="newPassword" value={state.newPassword}
                                    />
                                </div>

                                <div className="account-sections-field">
                                    <label htmlFor="password">Confirm Password</label>
                                    <input
                                        onChange={(event) => changeState({ ...state, confPassword: event.target.value })}
                                        type="password" id="conf-password" name="conf-password" value={state.confPassword}
                                    />
                                </div>

                                <button onClick={(event) => handlePasswordChange(event)}>Change password</button>
                                {showMessage && <p className="success">{passwordMessage}</p>}
                                {showError && <p className="error">{error}</p>}
                            </form>
                        }

                        {activeIndex === 2 &&
                            <ul>
                                {showListMessage ? <p>{listsMessage}</p> :
                                    userLists?.map((list) => (
                                        <li key={list.name}>
                                            <p>{list.name}</p>
                                            <select name="lists" id="lilsts">
                                                {list?.items.length === 0 ?
                                                    <option> No items</option>
                                                    :
                                                    list?.items?.map((item) => (
                                                        <option key={item.id}>{item.name ?? item.title}</option>
                                                    ))
                                                }
                                            </select>
                                            <div onClick={() => handleDeleteList({ listId: list.id })}>
                                                <Image
                                                    src={"/icons/delete-icon.svg"}
                                                    height={30}
                                                    width={30}
                                                    alt={"delete icon"}
                                                />
                                            </div>
                                        </li>
                                    ))}
                            </ul>
                        }
                    </div>

                    <button
                        className="delete-account-button"
                        onClick={handleDeleteAccount}
                    >
                        Delete account
                    </button>

                    {showConfirmationDialog && <ConfirmationDialog />}
                </div>
            </main>
        </Layout >
    )
}

export default Account