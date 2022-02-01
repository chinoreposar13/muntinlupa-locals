import * as React from 'react';

import './orders.css';
import { Button, Col, InputGroup, Row } from "react-bootstrap";
import { CheckIcon, RemoveRedEyeIcon } from '../../assets/icon-assets';
import { Link, useParams } from 'react-router-dom';
import LoadingComponent from '../../loading/loading';
import { useState } from 'react';
import { convertCurrencyFormat, deliveryStatus, userTypes } from '../../public/models';
import FbFunctions, { AdminFbFunctions } from '../../firebase/funtions';
import { TextField } from '@mui/material';
import { SessionUser } from '../../public/session';
var getTotalAmount = (cartItems) => {
    let totalAmount = 0.00;
    
    if (cartItems.length > 0) {
        cartItems.forEach((item) => {
            totalAmount += item.total_price;
        });
    }
    return totalAmount;
}

var getTransactionByTransactionNo = async (transactionNumber) => { 
    let userTransaction = await FbFunctions.fbGetOrderByRefNo(transactionNumber);
    console.log('usertransactions', userTransaction);
    return userTransaction;
}


// var riders = [{
//     firstname: 'Chino',
//     lastname: 'Reposar',
//     username: 'userRider2'
// }, {
//     firstname: 'Mark',
//     lastname: 'Garcia',
//     username: 'userRider'
// }, ];

var getRiders = async () => {
    return await FbFunctions.fbGetRiders();
}

export default function OrdersBranchViewComponent() {
    const [riders, setRiders] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [shopCodes, setShopCodes] = useState([]);
    let {transNumberUrl} = useParams();

    const [transNumber, settransNumber] = useState('');
    const [deliveryman, setdeliveryman] = useState('');
    const [deliverystatus, setdeliverystatus] = useState('');
    const [subtotalprice, setsubtotalprice] = useState('');
    const [deliveryprice, setdeliveryprice] = useState(0.0);
    const [customerName, setcustomerName] = useState(''); 
    const [deliveryAddress, setdeliveryAddress] = useState(''); 
    

    const [isLoading, setIsLoading] = useState(true);
    const [onloadState, setonloadState] = useState(1);
    const [changeRiderState, setChangeRiderState] = useState(false);
    const [newRider, setNewRider] = useState(null);
    const [docId, setDocId] = useState('');

    var updateRiderDetails = async(riderUsername) => {
        // get delivery man name
        const riderName = riders.find((r)=> r.username === riderUsername).lastname + ', ' + riders.find((r)=> r.username === riderUsername).firstname;
        await AdminFbFunctions.updateStatus(docId, {delivery_man_id: riderUsername, delivery_man: riderName});
    }

    var changeRiderToggle = async () => {
        if (changeRiderState) {
            // TODO - Name
            setdeliveryman(riders.find((r)=> r.username === newRider).lastname + ', ' + riders.find((r)=> r.username === newRider).firstname);
            setChangeRiderState(false);
            await updateRiderDetails(newRider);
            alert('Success rider change!');
        } else {
            setChangeRiderState(true);
        }
        setNewRider(null);
    }

    var updateOrderStatus = async (docId, orderStatus) => {
        if (window.confirm("Do you want to Update Status?") == true) {
            setIsLoading(true);
            await AdminFbFunctions.updateStatus(docId, {delivery_status: orderStatus});
            setdeliverystatus(orderStatus);
            alert('Success udpate status!');
        } else {
            return;
        }
        setIsLoading(false);
    }

    if (onloadState === 1) {
        getTransactionByTransactionNo(transNumberUrl).then((order) => {
            // delivery_status = order.delivery_status;
            settransNumber(transNumberUrl);
            setdeliveryman(order.delivery_man);
            setdeliverystatus(order.delivery_status);
            setsubtotalprice(order.subtotal_price);
            setdeliveryprice(order.delivery_price);
            setcustomerName(order.fullname);

            setCartItems(JSON.parse(order.cartItems));
            setShopCodes(JSON.parse(order.shop_codes));
            setDocId(order.id);
            setdeliveryAddress(order.delivery_address);

            setIsLoading(false);
            getRiders().then((riders) => {
                setRiders(riders);
            });
        });
        setonloadState(2);
    }

return (
    <div className="order-container">
        <Row>
            <div className="col-6 left">
                <Link to="/admin/orders"><span> {'< Back'}</span></Link>
            </div>
        </Row>
        {(() => {
            if (isLoading) {
                return (<LoadingComponent/>)
            } 
        })()}
        <h1 className="mb-4">Order of {customerName}</h1>
                    <Row>
                        <Col sm={2} className="cart-item-list">
                        </Col>
                        <Col sm={8} className="cart-item-list mb-4">
                            <Row>
                                <Col sm={6} className="left">
                                    <Button variant="dark" className="mr-1" size="lg" 
                                    hidden={deliverystatus === deliveryStatus.delivered || SessionUser.getUserData().userType === userTypes.rider} 
                                    onClick={() => {changeRiderToggle()}}>Change Rider</Button>
                                    <Button variant="dark" className="" size="sm" hidden={deliverystatus === deliveryStatus.delivered || changeRiderState == false} onClick={() => {setChangeRiderState(false)}}>Cancel</Button>
                                    
                                    <Button variant="dark" className="mr-1" size="lg" 
                                    hidden={deliverystatus === deliveryStatus.delivered || SessionUser.getUserData().userType !== userTypes.rider} 
                                    onClick={() => {window.location = '/rider/order/'+transNumberUrl }}> View Map</Button>
                                </Col>
                                <Col sm={6} className="right" hidden={changeRiderState == true}>
                                    <Button variant="success" className="mr-1" size="lg" 
                                    hidden={deliverystatus === deliveryStatus.delivered}
                                    onClick={()=> {updateOrderStatus(docId, deliveryStatus.delivered)}}>DELIVERED</Button>

                                    <Button variant="warning" className="mr-1"size="lg" 
                                    hidden={deliverystatus === deliveryStatus.transit || deliverystatus === deliveryStatus.delivered}
                                    onClick={()=> {updateOrderStatus(docId, deliveryStatus.transit)}}>IN-TRANSIT</Button>
                                    <Button variant="danger" className="mr-3" size="lg" 
                                    hidden={deliverystatus === deliveryStatus.pending || deliverystatus === deliveryStatus.delivered}
                                    onClick={()=> {updateOrderStatus(docId, deliveryStatus.pending)}}>PENDING</Button>
                                </Col>
                            </Row>
                        </Col>
                        <Col sm={2} className="cart-item-list"></Col>
                    </Row>
                                    <Row>
                                                    <Col sm={2} className="cart-item-list"></Col>
                                                    {/* CART ITEMS PANEL */}
                                                    <Col sm={8} className="cart-item-list">
                                                        <Row>
                                                            <Col sm={12} className={"orders-table-functions "+ deliverystatus}>
                                                                <Row>
                                                                    <Col sm={4} lg={4} class="left ml-4">
                                                                        <span>Reference Number: <b>{transNumber}</b></span>
                                                                        <br></br>
                                                                        <span>Address: <b>{deliveryAddress}</b></span>
                                                                    </Col>
                                                                    {/* <Col sm={4} lg={4}>
                                                                        <span>Branch: <b>trans</b></span>
                                                                    </Col> */}
                                                                    <Col sm={4} lg={4}>
                                                                        <span>Rider Name: <b  hidden={changeRiderState == true}>{deliveryman || ''}</b>
                                                                            <InputGroup className="mb-4" size="xl">
                                                                                <TextField
                                                                                    id="municipal"
                                                                                    fullWidth 
                                                                                    select
                                                                                    onBlur={(e) => {
                                                                                        setNewRider(e.target.value);
                                                                                    }}
                                                                                    SelectProps={{
                                                                                        native: true,
                                                                                    }}
                                                                                    required
                                                                                    hidden={changeRiderState == false}
                                                                                    >
                                                                                    <option disabled>Select Municipal</option>
                                                                                    {riders.map((option, key) => (
                                                                                        <option key={option.username} value={option.username}>
                                                                                            {option.lastname + ', ' + option.firstname}
                                                                                        </option>
                                                                                    ))}
                                                                                </TextField>
                                                                            </InputGroup>
                                                                        </span>
                                                                    </Col>
                                                                    <Col sm={4} lg={4}>
                                                                        <span>Delivery Status: <b>{deliverystatus}</b></span>
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
                                                                shopCodes.map((shop) => {
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
                                                                                        {/* <span><Link to={"/shop/"+shop.branchCode+"/brand/"+shop.shopCode}> visit shop {'>'}</Link></span> */}
                                                                                    </Col>
                                                                                </Row>
                                                                            </Col>
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
                                                                    <span  className="v-align-m-content item-price"><span className="text-secondary">SubTotal Ammount:</span> P {convertCurrencyFormat(subtotalprice)}</span>
                                                                </Col>
                                                                <Col sm={12}  className="v-align-m right">
                                                                    <span  className="v-align-m-content item-price"><span className="text-secondary">Shipping Fee:</span> P {convertCurrencyFormat(deliveryprice)}</span>
                                                                </Col>
                                                                <Col sm={12}  className="v-align-m right">
                                                                    <span  className="v-align-m-content item-price"><span className="text-secondary">Total Amount:</span> P {convertCurrencyFormat(getTotalAmount(cartItems) + deliveryprice)}</span>
                                                                </Col>
                                                            </Col>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                <Col sm={2} className="cart-item-list"></Col>
                                                </Row>
        </div>
    );
    
}