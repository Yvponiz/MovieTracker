import type { NextApiRequest, NextApiResponse, NextPage } from 'next'
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import commonProps, { UserProps } from '../utils/commonProps';
import { addMouseMoveEffectToCards } from '../utils/mouseOver';

export function getServerSideProps({ req, res }: { req: NextApiRequest, res: NextApiResponse }) {
  return commonProps({ req, res })
}

const Home: NextPage<UserProps> = ({ isLoggedIn, username }) => {
  useEffect(() => {
    addMouseMoveEffectToCards("cards");
  }, []);

  return (
    <div className='container'>
      <main>
        {isLoggedIn ? <span className='greet'>Welcome {username}</span> : <></>}
        <div className='title'>
          <h1>Movie Tracker</h1>
          <Image
            src='/icons/3d-glasses.svg'
            width={50}
            height={50}
            alt="logo"
          />
        </div>

        <div id={'cards'}>
          <div className='card'>
            <div className='card-content'>
              <Link href={'/search'} className='index-link'>
                <p>Rechercher</p>
                <Image
                  src='/icons/magnifying-glass.svg'
                  width={50}
                  height={50}
                  alt="magnifying-glass"
                />
              </Link>
            </div>
          </div>

          <div className='card'>
            <div className='card-content'>
              <Link href={'/lists'} className='index-link'>
                <p>Movie & Series Lists</p>
                <Image
                  src='/icons/tv.svg'
                  width={50}
                  height={50}
                  alt="tv-icon"
                />
              </Link>
            </div>
          </div>

          <div className='card'>
            <div className='card-content'>
              {isLoggedIn ?
                <Link href='/api/logout' className='index-link'>
                  <p>Logout</p>
                  <Image
                    src='/icons/logout.svg'
                    width={50}
                    height={50}
                    alt="logout-icon"
                  />
                </Link> :
                <Link href="/login" className='index-link'>
                  <p>Login</p>
                  <Image
                    src='/icons/login.svg'
                    width={50}
                    height={50}
                    alt="login-icon"
                  />
                </Link>}
            </div>
          </div>

          <div className='card'>
            <div className='card-content'>
              <Link href="" className='index-link'>
                <p>Coming Soon</p>
                <Image
                  src='/icons/profile.svg'
                  width={50}
                  height={50}
                  alt="profile-icon"
                />
              </Link>
            </div>
          </div>

        </div>
      </main>


    </div>
  )
}

export default Home
