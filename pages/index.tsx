import type { NextPage } from 'next'
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { addMouseMoveEffectToCards } from '../utils/mouseOver';

const Home: NextPage = () => {

  useEffect(() => {
    addMouseMoveEffectToCards("cards");
  }, []);

  return (
    <div className='container'>
      <main>
        <div className='title'>
          <h1>Movie Tracker</h1>
          <Image
            src='/3d-glasses.svg'
            width={50}
            height={50}
            alt="logo"
          />
        </div>
        <div id={'cards'}>
          <div className='card'>
            <div className='card-content'>
              <Link href={'/searchPage'}>Rechercher</Link>
            </div>
          </div>

          <div className='card'>
            <div className='card-content'>
              <Link href={'/lists'}>Movie & Series Lists</Link>
            </div>
          </div>

          <div className='card'>
            <div className='card-content'>
              <Link href="/login">Login</Link>
            </div>
          </div>

          <div className='card'>
            <div className='card-content'>
              <Link href="">Coming Soon</Link>
            </div>
          </div>

        </div>
      </main>


    </div>
  )
}

export default Home
