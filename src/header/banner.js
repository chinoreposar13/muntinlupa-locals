import './header.css';
import logo from '../assets/logo.svg';

function Banner() {
    
  return (
    <div className="banner-container">
        <img src={logo} className="banner-logo fade-in-image"></img>
    </div>
  );
}

export default Banner;