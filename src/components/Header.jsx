import React from 'react';
import { Navbar, Container } from 'react-bootstrap';

function Header() {
  return (
    <Navbar bg='dark' variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand href="#home">
          Galeri Resep Afifa (UTS - 123140073)
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default Header;