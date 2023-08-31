import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '@/components/Layout';
import { appWithTranslation } from 'next-i18next';
import connectDB from '../utils/db';
import { UserProvider } from '../context/UserContext';

function App({ Component, pageProps }: AppProps) {
  connectDB;
  return (
    <UserProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserProvider>
  );
}
export default appWithTranslation(App);
