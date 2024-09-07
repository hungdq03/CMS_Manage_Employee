import React, { Fragment } from 'react'
import { AuthLayout } from './AuthLayout'
import { SignInForm } from './SignInForm'

export const SignInPage = () => {
  return (
    <Fragment>
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </Fragment>
  )
}
