import React from 'react'
import { Formik, Field, Form } from 'formik'
import formStyles from '../styles/LoginForm.module.css'
import { loginRequest } from '../utils/APIUtils';
import { handleLogin } from '../utils/Helpers';

export default function LoginForm() {
  return (
    <Formik
            initialValues={{
                username: '',
                password: '',
            }}
            onSubmit={async (values) => {
                await loginRequest(JSON.stringify(values, null, 2))
                    .then((response) => {
                        if(response){
                            handleLogin(response)
                        }else{
                            alert("failed to logg in")
                        }
                    })
            }}
        > 
            <Form>
                <Field name="email" type="email" placeholder="Epost" className={formStyles.field} />
                <Field name="password" type="password" placeholder="Passord" className={formStyles.field} />

                <div className={formStyles.buttons}>
                    <button type="submit" className={formStyles.button}>Logg inn</button>
                    <button type="submit" className={formStyles.button}>Opprett bruker</button>
                </div>
            </Form>
        </Formik>
  )
}
