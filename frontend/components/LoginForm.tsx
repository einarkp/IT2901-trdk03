import React, { useContext, useEffect, useState } from 'react'
import { Formik, Field, Form } from 'formik'
import formStyles from '../styles/LoginForm.module.css'
import { loginRequest } from '../utils/APIUtils';
import { handleLogin } from '../utils/Helpers';
import { LoginDetails, User } from '../Interfaces';
import { StoreContext } from '../pages/_app';
import { observer } from "mobx-react"

const LoginForm: React.FC = observer(() => {
const store = useContext(StoreContext)
  return (
    <Formik
            initialValues={{
                username: '',
                password: '',
            }}
            onSubmit={async (values) => {
                await loginRequest(JSON.stringify(values, null, 2))
                    .then((r) => {
                        var response = r as LoginDetails
                        if(response && response.successful){
                            localStorage.setItem("token", response.token ? JSON.stringify({"token": response.token, "expiry": response.expiry}) : "")
                            localStorage.setItem("user", response.user ? JSON.stringify(response.user) : "")
                            localStorage.setItem("password", values.password)

                            var activeUser: User = response.user as User;
                            store.setActiveUser(activeUser)
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
})
export default LoginForm;