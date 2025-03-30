import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import AlarmPanel from '../components/AlarmPanel';
import { JSX } from 'react';

export default function Home(): JSX.Element {
  return (
    <div className={styles.container}>
      <Head>
        <title>Contrôle d&apos;Alarme</title>
        <meta name="description" content="Interface de contrôle d&apos;alarme par SMS" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Système d&apos;Alarme
        </h1>
        
        <AlarmPanel />
      </main>

      <footer className={styles.footer}>
        <p>Système d&apos;Alarme par SMS</p>
      </footer>
    </div>
  );
} 