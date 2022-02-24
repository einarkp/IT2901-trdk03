import React from 'react'
import LoginForm from '../components/LoginForm'
import loginStyles from '../styles/login.module.css'

export default function Login() {
  return (
    <div className={loginStyles.card}>
        <h1 className={loginStyles.title}>Logg inn</h1>

        <div className={loginStyles.form}>
            <LoginForm />
        </div>
        
    </div>
  )
}
