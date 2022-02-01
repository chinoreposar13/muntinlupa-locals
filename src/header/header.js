import Banner from './banner';
import './header.css';
import Nav from 'react-bootstrap/Nav';
import { NavDropdown } from 'react-bootstrap';
import { useState } from 'react';
import { SessionUser } from '../public/session';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { userTypes} from '../public/models';

function logoutUser() {
  SessionUser.logoutUser();
  window.location = '/home';
}

function Header() {

  const [userData, setUserData] = useState(SessionUser.getUserData());

  const pathname = window?.location?.pathname || ''; 

  let header = '';
  if (userData && userData.userType !== userTypes.user) {
    
    header = <Nav bg="dark" variant="light" className="justify-content-center nav-items-container" activeKey="admin/dashboard">
    {/* <Nav.Item>
      <Nav.Link eventKey="/admin/dashboard" href={'/admin/dashboard'}  active={pathname.includes('admin/dashboard')}>DASHBOARD</Nav.Link>
    </Nav.Item> */}
    <Nav.Item>
      <Nav.Link eventKey="/admin/orders" href={'/admin/orders'} active={pathname.includes('admin/orders') || pathname.startsWith('/shop')}>ORDERS</Nav.Link>
    </Nav.Item>
    {/* <NavDropdown title="SETUP" active={pathname.includes('admin/branches')} id="nav-dropdown">
        <NavDropdown.Item eventKey="4.1" href={'/admin/branches'} active={pathname.includes('admin/branches')}>BRANCHES</NavDropdown.Item>
        <NavDropdown.Item eventKey="4.2">BRANDS</NavDropdown.Item>
        <NavDropdown.Item eventKey="4.1">PRODUCTS</NavDropdown.Item>
        <NavDropdown.Item eventKey="4.1">INVENTORY</NavDropdown.Item>
    </NavDropdown> */}
    {/* <NavDropdown title="REPORTS" id="nav-dropdown">
        <NavDropdown.Item eventKey="4.2">SALES REPORT</NavDropdown.Item>
        <NavDropdown.Item eventKey="4.1">INVENTORY REPORT</NavDropdown.Item>
    </NavDropdown> */}
    <Nav.Item>
      <Nav.Link eventKey="logout" onClick={() => logoutUser()}><FontAwesomeIcon icon="power-off"/> LOGOUT</Nav.Link>
    </Nav.Item>
  </Nav>
  } else {
    header = <Nav bg="dark" variant="light" className="justify-content-center nav-items-container" activeKey="/home">
    <Nav.Item>
      <Nav.Link eventKey="home" href="/home" active={pathname.startsWith('/home')}>HOME</Nav.Link>
    </Nav.Item>
    <Nav.Item>
      <Nav.Link eventKey="shop" href="/branches" active={pathname.startsWith('/branches') || pathname.startsWith('/shop')}>BRANCHES</Nav.Link>
    </Nav.Item>
    {/* <Nav.Item>
      <Nav.Link eventKey="hot" href="/hot" active={pathname.startsWith('/hot')}>HOT</Nav.Link>
    </Nav.Item> */}
    <Nav.Item>
      <Nav.Link eventKey="about" href="/about" active={pathname.startsWith('/about')}>ABOUT</Nav.Link>
    </Nav.Item>
    <Nav.Item>
      <Nav.Link eventKey="faq" href="/faq" active={pathname.startsWith('/faq')}>FAQ</Nav.Link>
    </Nav.Item>
    <Nav.Item hidden={userData != null}>
      <Nav.Link eventKey="login" href="/login" active={pathname.startsWith('/login')}>LOGIN</Nav.Link>
    </Nav.Item>
    <Nav.Item hidden={userData == null}>
      <Nav.Link eventKey="cart" href="/cart" active={pathname.startsWith('/cart')}><FontAwesomeIcon icon="shopping-cart"/> CART</Nav.Link>
    </Nav.Item>
    <Nav.Item hidden={userData == null}>
      <Nav.Link eventKey="order" href="/user-orders" active={pathname.startsWith('/user-orders')}><FontAwesomeIcon icon="file"/> ORDERS</Nav.Link>
    </Nav.Item>
    <Nav.Item hidden={userData == null}>
      <Nav.Link eventKey="logout" onClick={() => logoutUser()}><FontAwesomeIcon icon="power-off"/> LOGOUT</Nav.Link>
    </Nav.Item>
  </Nav>
  }
  return (
    <div className="header">
      <div>
        <Banner />
      </div>
      <div className="row" >
        <header className="header-container">
          {header}
        </header>
      </div>
    </div>
  );
}

export default Header;
