import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '@/components/Layout';
import { appWithTranslation } from 'next-i18next';
import Head from 'next/head';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

import { UserProvider } from '../context/UserContext';
interface MyAppProps extends AppProps {
  session: Session;
}
function App({ Component, pageProps, session }: MyAppProps) {
  return (
    <>
      <Head>
        <meta
          name="google-site-verification"
          content="-2GddDfhrkTpIBW-wrFLeFF2skPg2g06Mf7ioEaFom4"
        />
      </Head>
      <SessionProvider session={session}>
        <UserProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </UserProvider>
      </SessionProvider>
    </>
  );
}
export default appWithTranslation(App);
