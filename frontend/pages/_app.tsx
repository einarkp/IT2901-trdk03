import React from 'react';
import Layout from '../components/Layout'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import userStore from '../helpers/ObservableUserStore';

export const StoreContext = React.createContext(userStore);

function MyApp({ Component, pageProps }: AppProps) {
  
  return ( 
      <Layout>
        <StoreContext.Provider value={userStore}>
          <Component {...pageProps} />
        </StoreContext.Provider>
      </Layout>
    )
}

export default MyApp
