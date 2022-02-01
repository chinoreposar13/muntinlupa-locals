import './about.css';
import logo from '../assets/logo.svg';
 
function AboutComponent() {
    return (
        <div className="about-page">
            <div className="row">
                <div className="col-12">
                    <img src={logo} className="fade-in-image logo-about"></img>
                    <h1 className="about-us-title">About Us</h1>
                    <div>
                    <p>The Founder of Muntinlupa Locals is Patrick Anthony Aquino, Established june 2020</p>
                    <p>Muntinlupa locals is a street wear movement from Muntinlupa City. Muntinlupa Locals is a merch shop supporting local brand originated from Muntinlupa City</p>
                    <p>A collection of clothing lines within the City</p>
                    <p>Local supporting local</p>
                    <p>Remember to like us on Facebook, or follow us on instagram, to connect with us and be part of the Muntinlupa Locals experience</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default AboutComponent;