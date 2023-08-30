import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '@/components/Layout';
import { appWithTranslation } from 'next-i18next';
import connectDB from '../utils/db';
function App({ Component, pageProps }: AppProps) {
  connectDB;
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
export default appWithTranslation(App);
