import type { NextApiRequest, NextApiResponse, NextPage } from 'next'
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import commonProps, { UserProps } from '../utils/commonProps';
import { addMouseMoveEffectToCards } from '../utils/mouseOver';
import Layout from '../components/layout';

export function getServerSideProps({ req, res }: { req: NextApiRequest, res: NextApiResponse }) {
  return commonProps({ req, res })
}

const Home: NextPage<UserProps> = ({ isLoggedIn, username }) => {
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 500 : false;
  const imgSize = isMobile ? 30 : 50;

  useEffect(() => {
    addMouseMoveEffectToCards("cards");
  }, []);

  return (
    <Layout>
      <div className='container'>
        <main>
          {isLoggedIn ? <span className='greet'>Welcome {username}</span> : <></>}
          <div className='title'>
            <h1>Movie Tracker</h1>
            <Image
              src='/icons/3d-glasses.svg'
              width={imgSize}
              height={imgSize}
              alt="logo"
            />
          </div>

          <div id={'cards'}>
            <Link href={'/search'} className='card'>
              <div className='card-content'>
                <p>Search</p>
                <Image
                  src='/icons/magnifying-glass.svg'
                  width={imgSize}
                  height={imgSize}
                  alt="magnifying-glass"
                />
              </div>
            </Link>

            <Link href={'/lists'} className='card'>
              <div className='card-content'>
                <p>Movie & Series Lists</p>
                <Image
                  src='/icons/tv.svg'
                  width={imgSize}
                  height={imgSize}
                  alt="tv-icon"
                />
              </div>
            </Link>

            {isLoggedIn ?
              <Link href='/api/logout' className='card'>
                <div className='card-content'>
                  <p>Logout</p>
                  <Image
                    src='/icons/logout.svg'
                    width={imgSize}
                    height={imgSize}
                    alt="logout-icon"
                  />
                </div>
              </Link>
              :
              <Link href="/login" className='card'>
                <div className='card-content'>
                  <p>Login</p>
                  <Image
                    src='/icons/login.svg'
                    width={imgSize}
                    height={imgSize}
                    alt="login-icon"
                  />
                </div>
              </Link>
            }

            <Link href="" className='card'>
              <div className='card-content'>
                <p>Coming Soon</p>
                <Image
                  src='/icons/profile.svg'
                  width={imgSize}
                  height={imgSize}
                  alt="profile-icon"
                />
              </div>
            </Link>

          </div>
        </main>
      </div>
    </Layout>
  )
}

export default Home
