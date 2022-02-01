
import React, { useState } from 'react';
import './App.css';
import Header from './header/header';
import HomeComponent from './home/home';

import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';
import Footer from './footer/footer';
import FaqComponent from './faq/faq';
import AboutComponent from './about/about';
import LoginComponent from './login/login';
import SignupComponent from './signup/signup';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser, faLock, faEnvelope, faPhone, faMapMarkedAlt, faTrashAlt, faPowerOff, faShoppingCart , faFile, faMapPin} from '@fortawesome/free-solid-svg-icons';
import ShopComponent from './shop/shop';
import ShopBrandItemsComponent from './shop/shop-items';
import BranchComponent from './branch/branch';
import CartComponent from './cart/cart';
import DashboardComponent from './admin/dashboard/dashboard';
import AdminBranchesComponent from './admin/setups/adminBranches/adminBranches';
import AdminBranchesNewComponent from './admin/setups/adminBranches/adminBranchesNew';
import OrdersComponent from './admin/orders/orders';
import OrdersBranchViewComponent from './admin/orders/ordersBranchView';
import ShopBrandItemDetailComponent from './shop/shop-item-details';
import { SessionUser } from './public/session';
import UserOrderComponent from './user-order/user-order';
import RiderTransactionComponent from './rider-transaction/rider-transaction';

library.add(faUser, faLock, faEnvelope, faPhone, faMapMarkedAlt, faTrashAlt, faPowerOff, faShoppingCart, faFile, faMapPin);

function App() {
  const isUserLoggedIn = (props) => {
      if (!!SessionUser.getUserData() || SessionUser.getUserData() == {}) {
        console.log(SessionUser.getUserData());
        window.location = '/login';
        console.log('awit');
      }
      return props;
  }
  return (
    <Router>
      <div className="App">
        <Header />
        <div className="page-container">
          <Switch>
            <Route exact path="/login" component={LoginComponent}></Route>
            <Route exact path="/signup" component={SignupComponent}></Route>
            {/* <Route exact path="/home" component={() => isUserLoggedIn(HomeComponent)}></Route> */}
            <Route exact path="/home" component={HomeComponent}></Route>
            <Route exact path="/faq" component={FaqComponent}></Route>
            <Route exact path="/about" component={AboutComponent}></Route>
            <Route exact path="/branches" component={BranchComponent}></Route>
            <Route exact path="/shop/:branchCode" component={ShopComponent}></Route>
            <Route exact path="/shop/:branchCode/brand/:shopCode" component={ShopBrandItemsComponent}></Route>
            <Route exact path="/shop/:branchCode/brand/:shopCode/item/:itemCode" component={ShopBrandItemDetailComponent}></Route>
            <Route exact path="/cart" component={CartComponent}></Route>
            <Route exact path="/user-orders" component={UserOrderComponent}></Route>
            
            
            {/* ADMIN PAGES */}
            <Route exact path="/admin/dashboard" component={DashboardComponent}></Route>
            <Route exact path="/admin/orders" component={OrdersComponent}></Route>
            <Route exact path="/admin/orders/:transNumberUrl" component={OrdersBranchViewComponent}></Route>
            <Route exact path="/rider/order/:transNumberUrl" component={RiderTransactionComponent}></Route>
            
            
            {/* SETUP PAGES */}
            <Route exact path="/admin/branches/new" component={AdminBranchesNewComponent}></Route>
            <Route exact path="/admin/branches/edit/:branchId" component={AdminBranchesNewComponent}></Route>
            <Route exact path="/admin/branches" component={AdminBranchesComponent}></Route>
          </Switch>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
