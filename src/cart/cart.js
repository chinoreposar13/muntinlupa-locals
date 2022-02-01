import './cart.css';
import { Button, Col, Row } from "react-bootstrap";
import { Checkbox, TextField } from '@mui/material';

import dbtkBrandLogo from '../assets/images/brands/dbtk-logo-black.png';
import hotAlien from '../assets/images/hot/Hot_alien.jpg';

import SessionCartItems, { SessionUser } from '../public/session';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';
import { municipalCodes, barangays, convertCurrencyFormat, generateTransactionNumber, deliveryStatus } from '../public/models';
import FbFunctions from '../firebase/funtions';
import LoadingComponent from '../loading/loading';

var clientCartItems = () => {
    console.log(SessionCartItems.getCartItems());
    return SessionCartItems.getCartItems() || [];
}

var clientShopCodes = () => {
    console.log(SessionCartItems.getShopCodes());
    return SessionCartItems.getShopCodes() || [];
}

var clientBranchCodes = () => {
    return  SessionCartItems.getBranchCodes();
}


var getUserData = () => {
    return SessionUser.getUserData() || '';
}

var getItemSubTotal = (cartItems) => {
    let sub = 0;
    if (cartItems.length > 0) {
        cartItems.forEach((item) => {
            sub += item.quantity;
        });
    }
    return sub;
}

var getTotalAmount = (cartItems) => {
    let totalAmount = 0.00;
    
    if (cartItems.length > 0) {
        cartItems.forEach((item) => {
            totalAmount += item.total_price;
        });
    }
    return totalAmount;
}

function CartComponent() {
    const [cartItems, setCartItems] = useState(clientCartItems() || []);
    const [shopCodes, setShopCodes] = useState(clientShopCodes() || []);
    const [branchCodes, setBranchCodes] = useState(clientBranchCodes() || []);
    const [currentLocation, setCurrentLocation] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [onloadState, setonloadState] = useState(1);

    if (onloadState === 1) {
        setIsLoading(false);
        setonloadState(2);
    }
    
    function showPosition(position) {
        setCurrentLocation({lat: position.coords.latitude, long: position.coords.longitude })
    }
    if (navigator.geolocation) {
        var timeoutVal = 10 * 1000 * 1000;
        navigator.geolocation.getCurrentPosition(showPosition,  null,
            { enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0 });
    }
    
    var checkOutCart = async (cartItems, shopcodes) => {
        if (window.confirm("Do you want to Check out?") == true) {
            
        setIsLoading(true);
            let transactionNumber = await FbFunctions.fbGetCheckOutLastTransaction() || [];
            // let lastTransaction = transactionNumber.length > 0 ? transactionNumber.sort((firstItem, secondItem) => 
            // Number(secondItem.transactionNumber.substring(8, secondItem.transactionNumber.length)) -
            // Number(firstItem.transactionNumber.substring(8, firstItem.transactionNumber.length))
            // )[0].transactionNumber : 0;
            // let lastTransactionNumber = Number(lastTransaction.substring(8, lastTransaction.length));
            
            let newOrderDate = new Date();
            var month = newOrderDate.getUTCMonth() + 1;
            var year = newOrderDate.getUTCFullYear();
            var day = newOrderDate.getDate();
            let dateNow = year + '-' + month + '-' + day;
            let lastTransactionNumber = transactionNumber.length;
            let checkoutData = {
                cartItems: JSON.stringify(cartItems),
                delivery_man:'',
                delivery_price: 45,
                delivery_status: deliveryStatus.pending,
                remarks: '',
                shop_codes: JSON.stringify(shopcodes),
                subtotal_price: getTotalAmount(cartItems),
                total: getTotalAmount(cartItems) + 45,
                transactionNumber: generateTransactionNumber(lastTransactionNumber),
                transaction_date_time: dateNow,
                username: getUserData().username,
                delivery_address: getUserData().userAddress,
                fullname: getUserData().lastName + ', ' + getUserData().firstName,
                lat: currentLocation.lat  || 14.408133,
                long: currentLocation.long || 121.041466
            };
            await FbFunctions.fbCheckOutOrders(checkoutData);
            alert('Successful Checkout');
            SessionUser.removeAllCartItems();
            window.location = '/user-orders';
        } else {
            return;
        }
    }
    
    const adjustItemQuantity = (item, action) => {
            const newCartItems = [];
            let itemKey = 0;
            cartItems.forEach((a, key)=>{
                if(a.code === item.code && a.color === item.color) {
                    if (action === 'add') {
                        a.total_price = a.total_price + (Number(a.price));
                        a.quantity = a.quantity + 1;
                    } else {
                        a.total_price = a.total_price - (Number(a.price));
                        a.quantity = a.quantity - 1; 
                    }
                    itemKey = key;
                }
                newCartItems.push(a);
            });
            setCartItems(newCartItems);

        SessionCartItems.updateCartItem(newCartItems[itemKey], action);
            
    };

    var removeItem = (item) => {
        //TODO
        SessionCartItems.updateCartItem(item, 'remove');
        setShopCodes(clientShopCodes());
        setCartItems(clientCartItems());
        return;
    }

    const [nothingToDisplay, setNothingToDisplay] = useState([]);
    useEffect(() => {
        let nothing = [];
        if (cartItems.length == 0) {
            nothing.push(
                <div>
                    Nothing to Display ...
                </div>
            )
            setNothingToDisplay(nothing);
        } else {
            setNothingToDisplay(nothing);
        }
    }, [cartItems]);

    return (
    <div className="cart-container">
        <h1 className="mb-4">Your Cart</h1>
        <Row>
            {(() => {
                if (isLoading) {
                    return (<LoadingComponent/>)
                }
            })()}
            
            {/* CART ITEMS PANEL */}
            <Col sm={8} className="cart-item-list">
                <Row>
                    {/* <Col sm={12} className="cart-table-functions">
                        <Row>
                            <Col sm={1}>
                                <Checkbox></Checkbox>
                            </Col>
                            <Col sm={9}>
                                <span>Select all items ({cartItems.length} item/s)</span>
                            </Col>
                            <Col sm={2}>
                                <u>Delete</u>
                            </Col>
                        </Row>
                    </Col> */}
                    <Col sm={12} className="cart-table-items">
                    {nothingToDisplay}
                    {
                        // SHOPS
                        shopCodes.map((shop) => {
                            return (
                                <Row>
                                {/* HEADER */}
                                   { <Col sm={12} className="shop-desc-container">
                                        <Row>
                                            {/* <Col sm={1}>
                                                <Checkbox></Checkbox>
                                            </Col> */}
                                            <Col sm={12} className="shop-desc">
                                                {/* <span><img src={shop.logo}></img></span> */}
                                                <span>{shop.shopName} </span>
                                                <span><Link to={"/shop/"+shop.branchCode+"/brand/"+shop.shopCode}> visit shop {'>'}</Link></span>
                                            </Col>
                                        </Row>
                                    </Col>}
                                {/* ITEMS */}
                                    <Col sm={12}>
                                        {/* ITEM 1 */}
                                        {
                                            cartItems.filter(item => item.shopCode === shop.shopCode).map((item) => {
                                                return(
                                                    <Row className="mb-2 cart-item-container">
                                                        <Col sm={1} className="v-align-m">
                                                            {/* <span className="v-align-m-content"><Checkbox></Checkbox></span> */}
                                                        </Col>
                                                        <Col sm={11}>  
                                                            <Row>
                                                                <Col sm={1}>
                                                                    <span><img className="brand-item-img" src={item.logo}/></span>
                                                                </Col>
                                                                <Col sm={7} className="v-align-m">
                                                                    <Col sm={12} className="v-align-m-content item-desc">
                                                                        <Col sm={12}><strong>{item.name}</strong></Col>
                                                                        <Col sm={12}>Shirt Color: {item.color}</Col>
                                                                        {/* <Col sm={12}><strong>Don't Blame the Kids Oversize T-Shirt</strong></Col>
                                                                        <Col sm={12}>HUE Series, Shirt Color: Black</Col> */}
                                                                    </Col>
                                                                </Col>
                                                                <Col sm={2}  className="v-align-m">
                                                                    <span  className="v-align-m-content item-price">P {convertCurrencyFormat(item.total_price)}</span>
                                                                </Col>
                                                                <Col sm={2} className="v-align-m">
                                                                    <span className="v-align-m-content">
                                                                    <Button className={item.quantity > 1 ? '' : 'disabled'} small onClick={()=>{if(item.quantity > 1){adjustItemQuantity(item, 'minus')}}}>-</Button> {item.quantity} <Button onClick={()=>adjustItemQuantity(item, 'add')}>+</Button> <Button onClick={()=>removeItem(item)}>
                                                                        <FontAwesomeIcon icon="trash-alt"/>
                                                                    </Button></span>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                )
                                            })
                                        }
                                    </Col>
                                </Row>
                            )
                        })
                    }
                    </Col>
                </Row>
            </Col>
            {/* CHECK OUT SUMMARY PANEL */}
            <Col sm={4} className="cart-summary-container">
                <Row className="summary-content">
                    <Col sm={12} className="t-left">
                        <span><h3>Location</h3></span>
                    </Col>
                    <Col sm={12} className="t-left">
                        <span>{getUserData().street + ', ' + barangays.find((a)=>a.code == getUserData().barangay).name + ', ' 
                        + municipalCodes.find((a)=>a.id == getUserData().municipal).name}</span>
                    </Col>
                    <Col sm={12} className="t-left">
                        <span><h3>Order Summary</h3></span>
                    </Col>
                         {(() => {
                            if (cartItems.length > 0) {
                                return (
                                    <Row>
                                        <Col sm={12}>
                                            <Row className="order-summary-content">
                                                <Col sm={8} className="title">
                                                                <span> SubTotal ({getItemSubTotal(cartItems)} Items) </span>
                                                </Col>
                                                <Col sm={4}  className="item-price">
                                                    
                                                {(() => {
                                                        if (cartItems.length > 0) {
                                                            return (
                                                                <span> P {convertCurrencyFormat(getTotalAmount(cartItems))}</span>
                                                            )
                                                        } else {
                                                        return (nothingToDisplay)
                                                        }
                                                    })()}
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col sm={12}>
                                            <Row className="shipping-summary">
                                                <Col sm={8} className="title">
                                                    Shipping Fee
                                                </Col>
                                                <Col sm={4}  className="item-price">
                                                    <span>P 45</span>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col sm={12}>
                                            <Row className="total-summary">
                                                <Col sm={8} className="title">
                                                    <h3>TOTAL</h3>
                                                </Col>
                                                <Col sm={4}  className="item-price">
                                                    <span>P {convertCurrencyFormat(getTotalAmount(cartItems) + 45.00)}</span>
                                                    {/* <p>VAT included, where applicable</p> */}
                                                </Col>
                                            </Row>
                                        </Col>
                                        </Row>
                                            )
                                        } else {
                                        return (nothingToDisplay)
                                        }
                                    })()}
                    
                    
                </Row>
            </Col>
        </Row>
        <Row>
            <Col sm={12} className="cart-checkout-container">
                <Button onClick={() => checkOutCart(cartItems, shopCodes)} hidden={cartItems.length == 0}>Proceed to checkout</Button>
            </Col>
        </Row>
    </div>
    );
}

export default CartComponent;