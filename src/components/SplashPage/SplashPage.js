import React from 'react'
import './SplashPage.scss'
import { useAuth0 } from "@auth0/auth0-react";
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

export const SplashPage = ({
  title,
  ...props
}) => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className='jumbotron vertical-center'>
      <Container>
        <Card className='mx-auto d-block align-items-center' style={{ width: '10rem' }}>
          <img
            // className='shining'
            style={{ width: '4rem' }}
            src='/logo.svg'
            alt='alex-logo'
          />
          <div className='mx-auto text-center'>
            <h3 className='mt-2 logo-text'>ALEXANDRIE</h3>
          </div>
          <Button size="sm" variant="primary" className='mx-auto text-center' onClick={() => loginWithRedirect()}>Login</Button>

        </Card>
      </Container>
    </div>
  )
}

export default SplashPage
