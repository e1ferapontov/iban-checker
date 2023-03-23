import styles from '@/styles/Home.module.css';
import {
  IBANValidationResult,
  RESULTS_LENGTH,
  validateIBAN
} from '@/utils/iban';
import Head from 'next/head';
import { FormEvent, useCallback, useState } from 'react';

export default function Home() {
  const [IBAN, setIBAN] = useState('');
  const [results, setResults] = useState<IBANValidationResult[]>([]);

  const addResult = useCallback(
    (iban: string, valid: boolean) => {
      const result = { iban, valid, timestamp: Date.now() };

      if (results.length < RESULTS_LENGTH) {
        setResults([result, ...results]);
      } else {
        setResults([result, ...results.slice(0, RESULTS_LENGTH - 1)]);
      }

      setIBAN('');
    },
    [results],
  );

  const checkIBAN = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      addResult(IBAN, validateIBAN(IBAN));
    },
    [addResult, IBAN],
  );
  return (
    <>
      <Head>
        <title>IBAN checker</title>
        <meta name="description" content="Check Montenegro IBAN numbers" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.header}>Check Montenegro IBAN</h1>
          <form className={styles.form} onSubmit={checkIBAN}>
            <input
              type={'text'}
              value={IBAN}
              onChange={(e) => setIBAN(e.target.value)}
              className={styles.input}
            />
            <button type="submit" onClick={checkIBAN} className={styles.button}>
              Check
            </button>
          </form>
          <ul className={styles.results}>
            {results.map((validationResult) => (
              <li key={validationResult.iban + validationResult.timestamp}>
                {validationResult.valid ? '✅' : '❌'} {validationResult.iban}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}
