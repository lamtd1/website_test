import React from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap'   // import từ react-bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'              // đừng quên import CSS
import {Link} from 'react-router-dom'
import {useAuth} from '../auth'

const LoggedInLinks = ({ onLogout }) => {
  return (
    <>
    <Nav.Link as={Link} to="/">Home</Nav.Link>
    <Nav.Link as={Link} to="/create-recipe">Create Recipe</Nav.Link>
  <Nav.Link as="button" onClick={onLogout}>Log out</Nav.Link>
    </>
  )
}

const LoggedOutLink = () => {
  return (
    <>
      <Nav.Link as={Link} to="/">Home</Nav.Link>
      <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>
      <Nav.Link as={Link} to="/login">Login</Nav.Link>
    </>
  )
}

const NavBar = () => {
  const { isLoggedIn, logout } = useAuth()
  return (
    <>

      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand as={Link} to="/">Recipes</Navbar.Brand>
          <Nav className="me-auto">
            {isLoggedIn ? <LoggedInLinks onLogout={logout}/> : <LoggedOutLink/>}
          </Nav>
        </Container>
      </Navbar>

        <br/>
    </>
  )
}

export default NavBar
