import React, { useContext, useEffect, useState } from 'react'
import { Formik, Field, Form } from 'formik'
import formStyles from '../styles/LoginForm.module.css'
import { loginRequest } from '../utils/APIUtils';
import { handleLogin } from '../utils/Helpers';
import { LoginDetails, User, UserTypes } from '../Interfaces';
import { StoreContext } from '../pages/_app';

export default function LoginForm() {
    const store = useContext(StoreContext)
  return (
    <Formik
            initialValues={{
                username: '',
                password: '',
            }}
            onSubmit={async (values) => {
                await loginRequest(JSON.stringify(values, null, 2))
                    .then((response) => {
                        if(response && response.successful){
                            handleLogin(response as LoginDetails)
                            var activeUser: User = {username: values.username, token: response.token!, schoolID: 'example', type: UserTypes.normal}
                            localStorage.setItem("user", JSON.stringify(activeUser))
                            localStorage.setItem("password", values.password)
                            store.setActiveUser(JSON.parse(localStorage.getItem("user")!) as User)
                            //TODO: ikke hardkode denne, er også en dårlig løsning
                            window.location.href = '/totalOversikt?' + "id="+store.activeUser?.schoolID+"&year=2022"
                        }else{
                            alert("failed to logg in")
                        }
                    })
            }}
        > 
            <Form>
                <Field name="username" type="username" placeholder="Username" className={formStyles.field} />
                <Field name="password" type="password" placeholder="Passord" className={formStyles.field} />

                <div className={formStyles.buttons}>
                    <button type="submit" className={formStyles.button}>Logg inn</button>
                </div>
            </Form>
        </Formik>
  )
}
