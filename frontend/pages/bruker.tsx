import React, { useContext } from 'react'
import loginStyles from '../styles/login.module.css'
import { StoreContext } from './_app'

export default function Bruker() {

  const store = useContext(StoreContext)
  return (
    <div className={loginStyles.card}>
      <h1 className={loginStyles.title}>{store.activeUser?.username}</h1>
    </div>
  )
}
