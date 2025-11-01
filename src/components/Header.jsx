import React from 'react';
import { Navbar, Container } from 'react-bootstrap';

function Header() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand href="#home">
          🍳 Recipe Finder (UTS - NIM Akhiran 3)
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default Header;