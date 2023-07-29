import { NextApiRequest, NextApiResponse, NextPage } from "next";
import Layout from "../components/layout";
import commonProps, { UserProps } from "../utils/commonProps";
import { useEffect, useState } from "react";
import { User } from "../models/user";

export function getServerSideProps({ req, res }: { req: NextApiRequest, res: NextApiResponse }) {
    return commonProps({ req, res })
}

const Dashboard: NextPage<UserProps> = ({ isLoggedIn, userType }) => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        fetch("/api/users/getUsers")
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    setUsers(data.usersListInfo)
                }
            })
    }, []);

    const toggleList = (userId: string, listName: string) => {
        setUsers((prevUsers) =>
            prevUsers.map((user) => {
                if (user.id === userId) {
                    return {
                        ...user,
                        lists: user.lists?.map((list) =>
                            list.name === listName ? { ...list, isOpen: !list.isOpen } : list
                        ),
                    };
                }
                return user;
            })
        );
    };

    return (
        <Layout isLoggedIn={isLoggedIn} userType={userType}>
            <div className="dashboard-wrapper">
                {users?.map((user) => (
                    <div className='users-board' key={user.id}>
                        <h2>{user.username}</h2>
                        <h3>{user.email}</h3>
                        <ul>
                            {user.lists?.map((list) => (
                                <li key={list.name}>
                                    <p className='user-list-name' onClick={() => toggleList(user.id!, list.name)}>
                                        {list.name}
                                        <span>{list.isOpen ? ' -' : ' +'}</span>
                                    </p>
                                    {list.isOpen && (
                                        <select name="lists" id="lists">
                                            {list?.items.length === 0 ? (
                                                <option>No items</option>
                                            ) : (
                                                list?.items?.map((item) => (
                                                    <option key={item.id}>{item.name ?? item.title}</option>
                                                ))
                                            )}
                                        </select>
                                    )}
                                </li>
                            ))}
                        </ul>
                        <button className="delete-account-button">Delete</button>
                    </div>
                ))}
            </div>
        </Layout>
    )

}

export default Dashboard;