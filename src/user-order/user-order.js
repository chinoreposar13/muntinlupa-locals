import { useEffect } from "react";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import FbFunctions from "../firebase/funtions";
import LoadingComponent from "../loading/loading";
import { convertCurrencyFormat } from "../public/models";
import SessionCartItems, { SessionUser } from "../public/session";
import './user-order.css';

var clientCartItems = () => {
    console.log(SessionCartItems.getCartItems());
    return SessionCartItems.getCartItems() || [];
}

var clientShopCodes = () => {
    console.log(SessionCartItems.getShopCodes());
    return SessionCartItems.getShopCodes() || [];
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

var getUserTransactions = async () => { 
    let userTransactions = await FbFunctions.fbGetCheckOutOrders(SessionUser.getUserData().username); 
    let transactions = userTransactions.map((transaction)=>{
        transaction.cartItems = JSON.parse(transaction.cartItems);
        transaction.shop_codes = JSON.parse(transaction.shop_codes);
        return transaction;
    }).sort((firstItem, secondItem) =>
    Number(secondItem.transactionNumber.substring(8, secondItem.transactionNumber.length)) -
    Number(firstItem.transactionNumber.substring(8, firstItem.transactionNumber.length))
    );
    console.log('usertransactions', transactions);
    return transactions;
}

export default function UserOrderComponent () {
    // const [cartItems, setCartItems] = useState(clientCartItems());
    // const [shopCodes, setShopCodes] = useState(clientShopCodes());
    const [userTransactions, setUserTransactions] = useState([]);
    const [nothingToDisplay, setNothingToDisplay] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [onloadState, setonloadState] = useState(1);

    if (onloadState === 1) {
        getUserTransactions().then((a) => {
            console.log('transactionsssssss', a);
            setUserTransactions(a);
            setIsLoading(false);
        });
        setonloadState(2);
    }

    useEffect(() => {
        let nothing = [];
        if (userTransactions.length == 0) {
            nothing.push(
                <div>
                    Nothing to Display ...
                </div>
            )
            setNothingToDisplay(nothing);
        } else {
            setNothingToDisplay(nothing);
        }
    }, [userTransactions]);
    return (
        <div className="cart-container">
            {(() => {
                if (isLoading) {
                    return (<LoadingComponent/>)
                }
            })()}
            <h1 className="mb-4">Your Orders</h1>
            {nothingToDisplay}
            {
                        userTransactions.map((trans) => {
                            
                            return(
                            <Row>
                                            <Col sm={2} className="cart-item-list"></Col>
                                            {/* CART ITEMS PANEL */}
                                            <Col sm={8} className="cart-item-list">
                                                <Row>
                                                    <Col sm={12} className={"orders-table-functions "+ trans.delivery_status}>
                                                        <Row>
                                                            <Col sm={4} lg={4}>
                                                                <span>Reference Number: <b>{trans.transactionNumber}</b></span>
                                                            </Col>
                                                            {/* <Col sm={4} lg={4}>
                                                                <span>Branch: <b>trans</b></span>
                                                            </Col> */}
                                                            <Col sm={4} lg={4}>
                                                                <span>Rider Name: <b>{trans.delivery_man || ''}</b></span>
                                                            </Col>
                                                            <Col sm={4} lg={4}>
                                                                <span>Delivery Status: <b>{trans.delivery_status}</b></span>
                                                            </Col>
                                                            {/* <Col sm={1}>
                                                                <Checkbox></Checkbox>
                                                            </Col>
                                                            <Col sm={9}>
                                                                <span>Select all items (2 item/s)</span>
                                                            </Col>
                                                            <Col sm={2}>
                                                                <u>Delete</u>
                                                            </Col> */}
                                                        </Row>
                                                    </Col>
                                                    <Col sm={12} className="cart-table-items">
                                                    {
                                                        // SHOPS
                                                        trans.shop_codes.map((shop) => {
                                                            return (
                                                                <Row>
                                                                {/* HEADER */}
                                                                <Col sm={12} className="shop-desc-container">
                                                                        <Row>
                                                                            {/* <Col sm={1}>
                                                                                <Checkbox></Checkbox>
                                                                            </Col> */}
                                                                            <Col sm={12} className="shop-desc">
                                                                                {/* <span>LOGO</span> */}
                                                                                <span>{shop.shopName} </span>
                                                                                <span><Link to={"/shop/"+shop.branchCode+"/brand/"+shop.shopCode}> visit shop {'>'}</Link></span>
                                                                            </Col>
                                                                        </Row>
                                                                    </Col>
                                                                {/* ITEMS */}
                                                                    <Col sm={12}>
                                                                        {/* ITEM 1 */}
                                                                        {
                                                                            trans.cartItems.filter(item => item.shopCode === shop.shopCode).map((item) => {
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
                                                                                                <Col sm={9} className="v-align-m">
                                                                                                    <Col sm={12} className="v-align-m-content item-desc">
                                                                                                        <Col sm={12}><strong>{item.name}</strong></Col>
                                                                                                        <Col sm={12}>Shirt Color: {item.color}</Col>
                                                                                                        <Col sm={12}>Quantity: {item.quantity}</Col>
                                                                                                        {/* <Col sm={12}><strong>Don't Blame the Kids Oversize T-Shirt</strong></Col>
                                                                                                        <Col sm={12}>HUE Series, Shirt Color: Black</Col> */}
                                                                                                    </Col>
                                                                                                </Col>
                                                                                                <Col sm={2}  className="v-align-m">
                                                                                                    <span  className="v-align-m-content item-price">P {convertCurrencyFormat(item.total_price)}</span>
                                                                                                    
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
                                                    <Col sm={12}>
                                                        <Col sm={12}  className="v-align-m right">
                                                            <span  className="v-align-m-content item-price"><span className="text-secondary">SubTotal Ammount:</span> P {convertCurrencyFormat(trans.subtotal_price)}</span>
                                                        </Col>
                                                        <Col sm={12}  className="v-align-m right">
                                                            <span  className="v-align-m-content item-price"><span className="text-secondary">Shipping Fee:</span> P {convertCurrencyFormat(trans.delivery_price)}</span>
                                                        </Col>
                                                        <Col sm={12}  className="v-align-m right">
                                                            <span  className="v-align-m-content item-price"><span className="text-secondary">Total Amount:</span> P {convertCurrencyFormat(getTotalAmount(trans.cartItems) + trans.delivery_price)}</span>
                                                        </Col>
                                                    </Col>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        <Col sm={2} className="cart-item-list"></Col>
                                        </Row>
                            )
                            })
                    }
        </div>
        );
}
