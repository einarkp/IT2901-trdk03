import React from 'react'
import { Formik, Field, Form } from 'formik'
import { TextField } from '@navikt/ds-react';
import formStyles from '../styles/LoginForm.module.css'

export default function LoginForm() {
  return (
    <Formik
            initialValues={{
                username: '',
                password: '',
            }}

            onSubmit={async (values) => {
                await new Promise((resolve) => setTimeout(resolve, 500));
                alert(JSON.stringify(values, null, 2));
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
