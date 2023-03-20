import { NextApiRequest, NextApiResponse, NextPage } from "next";
import Layout from "../components/layout";
import commonProps, { UserProps } from "../utils/commonProps";

export function getServerSideProps({ req, res }: { req: NextApiRequest, res: NextApiResponse }) {
    return commonProps({ req, res })
}

const Profile: NextPage<UserProps> = ({isLoggedIn, id, username, email}) => {
    return (
        <Layout isLoggedIn={isLoggedIn}>
            <span style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                fontSize: '2rem'
            }}>Coming Soon</span>
        </Layout>
    )
}

export default Profile