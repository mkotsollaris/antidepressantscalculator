"use client"; // this is a client component

import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from './page.module.css'
import SimpleLineGraph from '../components/SimpleChart'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <SimpleLineGraph/>
      </div>
    </main>
  )
}
