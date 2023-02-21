import type { NextPage } from 'next'
import Link from 'next/link';
import { useEffect } from 'react';
import Layout from '../component/layout';
import { addMouseMoveEffectToCards } from '../utils/mouseOver';

const List: NextPage = () => {

  useEffect(() => {
    addMouseMoveEffectToCards("cards");
  }, []);

  return (
    <Layout>
      <div className='container'>
        <main>

        </main>
      </div>
    </Layout>
  )
}

export default List
