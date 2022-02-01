import './shop.css';
import hotAlien from '../assets/images/hot/Hot_alien.jpg';
import hotHusga from '../assets/images/hot/Hot_husga.jpg';
import hotXunli from '../assets/images/hot/Hot_xunli.jpg';

import { useParams } from "react-router";
import { Link } from 'react-router-dom';

import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import SessionCartItems from '../public/session.js'; 
import { Autocomplete, TextField } from '@mui/material';
import { useState } from 'react';
import FbFunctions from '../firebase/funtions';
import LoadingComponent from '../loading/loading';

const getShopDoc = async (shopCode) => {
    let shopDoc = (await FbFunctions.fbGetShopByCode(shopCode));
    return shopDoc;
  }

var getItemDetails = async (itemCode) => {
    return await FbFunctions.fbGetItemByCode(itemCode);
}

function ShopBrandItemDetailComponent() {
    const [onloadState, setonloadState] = useState(1);
    const [shopDetails, setShopDetails] = useState({});
    const [itemDetails, setItemDetails] = useState({});
    let { itemCode, shopCode, branchCode } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [color, setColor] = useState('White');
    const [isLoading, setIsLoading] = useState(true);

    if (onloadState === 1) {
        getShopDoc(shopCode).then((shop) => {
            setShopDetails(shop);
        });
        getItemDetails(itemCode).then((item) => {
            item.price = item.price.toFixed(2);
            setItemDetails(item);
            setIsLoading(false);
        }) 
        setonloadState(2);
        setColor('White');
    }

    const addToCart = () => {
        let item = {
            code: itemDetails.code,
            name: itemDetails.name,
            logo: itemDetails.photo,
            price: itemDetails.price,
            shopCode: shopCode,
            color: color,
            quantity: quantity,
            branchCode: branchCode
        };
        SessionCartItems.setCartItems(item);
        console.log('item', item);

        SessionCartItems.setShopCodes({shopCode: shopDetails.code, shopName: shopDetails.name, branchCode: branchCode});
        window.location = '/cart';
      }
    // const brands = [
    //     {
    //         id:1,
    //         code: 'mntlpLocals',
    //         name: 'Muntinlupa Locals',
    //         logo: hotAlien
    //     },
    //     {
    //         id:2,
    //         code: 'thirstyKiddos',
    //         name: 'Thisty Kiddos',
    //         logo: hotHusga
    //     },
    //     {
    //         id:3,
    //         code: 'dbtk',
    //         name: 'Don\'t Blame The Kids',
    //         logo: hotXunli
    //     },
    // ];  
    // const brandItems = [
    //     {
    //         id:1,
    //         code: 'mntlpLocals',
    //         name: 'Alien',
    //         colors: 'Black / White',
    //         logo: hotAlien,
    //         price: 'P800.00'
    //     },
    //     {
    //         id:2,
    //         code: 'dbtk',
    //         name: 'X-Unlimited',
    //         colors: 'Black / White',
    //         logo: hotXunli,
    //         price: 'P3800.00'
    //     },
    //     {
    //         id:3,
    //         code: 'dbtk',
    //         name: 'X-Unlimited',
    //         colors: 'Black / White',
    //         logo: hotXunli,
    //         price: 'P500.00'
    //     },
    //     {
    //         id:4,
    //         code: 'dbtk',
    //         name: 'X-Unlimited',
    //         colors: 'Black / White',
    //         logo: hotXunli,
    //         price: 'P100.00'
    //     },
    // ];  
   
    return (
    <div className="shop-container">
        
        {(() => {
            if (isLoading) {
                return (<LoadingComponent/>)
            }
        })()}
        <div className="row">
            <div className="col-6 left">
                <Link to={"/shop/"+branchCode+"/brand/" + shopCode}><span> {'< Back'}</span></Link>
            </div>
            <div className="col-6 align-right">

            </div>
        </div>
        <div>
            <h1>Item Details</h1>
        </div>

        <hr />
        <div className="item-details-container">
            <div className="item-details-box">
                <Row>
                    <Col sm={5}>
                        <img className="item-details-img" src={itemDetails.photo || ''}/>
                    </Col>
                    <Col sm={7} className="item-details">
                        <Row>
                            <Col><span className="name">{itemDetails.name || ''}</span></Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col> <span className="price">P {itemDetails.price || '0.00'}</span></Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col><span>Brand: <span className="brand">{shopDetails.name}</span></span></Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col><Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={['White', 'Black']}
                                sx={{ width: 300 }}
                                defaultValue="White"
                                renderInput={(params) => <TextField {...params} label="Color" />}
                                onBlur={(e) => setColor(e.target.value)}
                                />
                            </Col>
                        </Row>
                        <hr />
                        <Row className='item-details-quantity'>
                            <Col>Quantity: 
                                <span>
                                    <button className={quantity === 1 ? 'ml-2 mr-2 disabled' : 'ml-2 mr-2'} onClick={()=> setQuantity(quantity - 1)} disabled={quantity === 1 ? true : false}> - </button>
                                    {quantity}
                                    <button className="ml-2" onClick={()=> setQuantity(quantity + 1)}> + </button>
                                </span>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12} className="add-to-cart-container">
                        <Button  onClick={() => addToCart()}>
                            Add to Cart
                        </Button>
                    </Col>
                </Row>
                {/* <Link to="/cart">
                    <Button onClick={() => addToCart(1)}>
                        Add to Cart
                    </Button>
                </Link> */}
            </div>
        </div>
    </div>
    );
}

export default ShopBrandItemDetailComponent;