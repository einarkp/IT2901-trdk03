import React from 'react';
import Layout from '../components/Layout'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import userStore from '../helpers/ObservableUserStore';
import Head from 'next/head';

export const StoreContext = React.createContext(userStore);

function MyApp({ Component, pageProps }: AppProps) {
  
  return ( 
      <Layout>
         <Head>
        <title>IT2901</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
        <StoreContext.Provider value={userStore}>
          <Component {...pageProps} />
        </StoreContext.Provider>
      </Layout>
    )
}

export default MyApp
