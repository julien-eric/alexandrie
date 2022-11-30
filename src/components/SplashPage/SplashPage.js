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
    <Container>
      <Card className='mt-5 m-auto splash-card' style={{ width: '18rem' }}>
        <Card.Img variant="top" src="./logolh.png" />
        <Card.Body>
          <Card.Title>Alexandrie</Card.Title>
          <Card.Text>
            Centraliser vos ressources.
          </Card.Text>
          <Button size="md" variant="primary" onClick={() => loginWithRedirect()}>Login</Button>
        </Card.Body>
      </Card>
    </Container>)
}

export default SplashPage
