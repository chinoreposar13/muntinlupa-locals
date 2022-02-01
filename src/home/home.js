import Carousel from 'react-bootstrap/Carousel';
import './home.css';
import slide1 from '../assets/images/slides/1.jpg';
import slide2 from '../assets/images/slides/2.jpg';
import slide3 from '../assets/images/slides/3.jpg';
import slide4 from '../assets/images/slides/4.jpg';
import slide5 from '../assets/images/slides/5.jpg';
import slide6 from '../assets/images/slides/6.jpg';
import slide7 from '../assets/images/slides/7.jpg';

import hotAlien from '../assets/images/hot/Hot_alien.jpg';
import hotHusga from '../assets/images/hot/Hot_husga.jpg';
import hotXunli from '../assets/images/hot/Hot_xunli.jpg';

function HomeComponent() {
    const brands = [
        {
            id:1,
            code: 'mntlpLocals',
            name: 'Muntinlupa Locals',
            logo: hotAlien
        },
        {
            id:2,
            code: 'thirstyKiddo',
            name: 'Thirsty Kiddo',
            logo: hotHusga
        },
        {
            id:4,
            code: 'dbtk',
            name: 'DBTK',
            logo: hotXunli
        },
        {
            id:2,
            code: 'thirstyKiddo',
            name: 'Thirsty Kiddo',
            logo: hotAlien
        },
        {
            id:4,
            code: 'dbtk',
            name: 'DBTK',
            logo: hotHusga
        },
        {
            id:1,
            code: 'mntlpLocals',
            name: 'Muntinlupa Locals',
            logo: hotXunli
        },
    ];  
    const brandDesigns = [];
    if (brands.length > 0){
        brands.forEach(brand => {
        
            brandDesigns.push(
                <div class="col-lg-3 col-md-6 col-sm-12 mt-2 mr-1 brand-item-container">
                    <img src={brand.logo}/>
                    <span className="brand-name">{brand.name}</span>
                </div>
            );
        });
    }
    return (
    <div className="home-container">
        <div className="home-carousel-container mb-4">
                <Carousel fade>
                <Carousel.Item>
                <img
                    className="d-block slideItem"
                    src={slide1}
                    alt="First slide"
                />
                <Carousel.Caption>
                    <h3>First slide label</h3>
                    <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                <img
                    className="d-block slideItem"
                    src={slide2}
                    alt="Second slide"
                />
            
                <Carousel.Caption>
                    <h3>Second slide label</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                <img
                    className="d-block slideItem"
                    src={slide3}
                    alt="Third slide"
                />
            
                <Carousel.Caption>
                    <h3>Third slide label</h3>
                    <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                <img
                    className="d-block slideItem"
                    src={slide4}
                    alt="Forth slide"
                />
            
                <Carousel.Caption>
                    <h3>Forth slide label</h3>
                    <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                <img
                    className="d-block slideItem"
                    src={slide5}
                    alt="Fifth slide"
                />
            
                <Carousel.Caption>
                    <h3>Fifth slide label</h3>
                    <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                <img
                    className="d-block slideItem"
                    src={slide6}
                    alt="Sixth slide"
                />
            
                <Carousel.Caption>
                    <h3>Sixth slide label</h3>
                    <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                <img
                    className="d-block slideItem"
                    src={slide7}
                    alt="Seventh slide"
                />
            
                <Carousel.Caption>
                    <h3>Seventh slide label</h3>
                    <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        </div>
        {/* END CAROUSEL */}
        
        <div class="separator"><h2>Best Selling Items</h2></div>
        <div className="row brand-container">
            {brandDesigns}
        </div>
    </div>
        
    );
}

export default HomeComponent;