import type { NextPage } from 'next'
import Link from 'next/link';
import { useEffect } from 'react';
import Layout from '../components/layout';
import { addMouseMoveEffectToCards } from '../utils/mouseOver';

const Home: NextPage = () => {

  useEffect(() => {
    addMouseMoveEffectToCards("cards");
  }, []);

  return (
    <div className='container'>
      <main>
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
              <Link href="">Sign Up</Link>
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
