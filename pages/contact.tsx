import { NextApiRequest, NextApiResponse, NextPage } from "next";
import Layout from "../components/layout";
import commonProps, { UserProps } from "../utils/commonProps";

export function getServerSideProps({ req, res }: { req: NextApiRequest, res: NextApiResponse }) {
    return commonProps({ req, res })
}

const Contact: NextPage<UserProps> = ({ isLoggedIn }) => {

    return (
        <Layout isLoggedIn={isLoggedIn}>
            <div className="contact">
            </div>
        </Layout>
    )
}

export default Contact