import {barangays, municipalCodes, sessionItems, userTypes} from './models';
var SessionCartItems = (function() {

  var getCartItems = function() {
    let sessionCartItems =  JSON.parse(getLocalStorageByItemName(sessionItems.cartItems)) || [];
    return sessionCartItems;    // Or pull this from cookie/localStorage
  };
  var updateCartItem = (item, action) => {
    let oldCartItems = getCartItems() || [];
    let oldShopItems = getShopCodes() ||  [];
    if(action === 'remove') {
      oldCartItems.forEach((a, key) => {
        if (a.branchCode === item.branchCode && a.code === item.code  && a.color === item.color) {
          oldCartItems.splice(key, 1);
        }
      });
      setLocalStorageByItemName(sessionItems.cartItems, JSON.stringify(oldCartItems));

      if (!oldCartItems.some((oldItem) => oldItem.shopCode === item.shopCode)) {
        // remove shop
        let newShopItems = oldShopItems.filter((shop) => shop.shopCode !== item.shopCode);
        setLocalStorageByItemName(sessionItems.shopCodes, JSON.stringify(newShopItems));
      }
    } else {
      oldCartItems.forEach((a, key) => {
        if (a.branchCode === item.branchCode && a.code === item.code  && a.color === item.color) {
          oldCartItems[key] = item;
        }
      });
      setLocalStorageByItemName(sessionItems.cartItems, JSON.stringify(oldCartItems));
    }
  }
  var setCartItems = function(item) {
    let oldCartItems = getCartItems() || [];
    item.total_price = item.quantity * item.price;

      // check if item is existed in cart
      if (oldCartItems.some(a => a.branchCode === item.branchCode && a.code === item.code  && a.color === item.color)
      && oldCartItems.length > 0) {
        let existingItem = oldCartItems.find(a => a.code === item.code 
          && a.branchCode === item.branchCode
          && a.color === item.color);
        existingItem.quantity = existingItem.quantity + item.quantity;
        existingItem.total_price = existingItem.total_price + item.total_price;
      } else if (
      !oldCartItems.some(a => a.branchCode === item.branchCode) && 
      !oldCartItems.some(a => a.code === item.code)) {
        oldCartItems.push(item);
      } else {
        oldCartItems.push(item);
      }
      alert('Success Adding to Cart!');
      setLocalStorageByItemName(sessionItems.cartItems, JSON.stringify(oldCartItems));
  };

  var getShopCodes = () => {
    let sessionShopCodes =  JSON.parse(getLocalStorageByItemName(sessionItems.shopCodes)) || [];
    return sessionShopCodes;
  }

  var setShopCodes = (shopDetails) => {
    let oldShopCodes = getShopCodes() || [];
    if (!oldShopCodes.some(a => a.shopCode === shopDetails.shopCode && a.branchCode === shopDetails.branchCode)) {
      oldShopCodes.push(shopDetails);
    }
    setLocalStorageByItemName(sessionItems.shopCodes, JSON.stringify(oldShopCodes));
  }
  
  var getBranchCodes = () => {
    let sessionShopCodes =  JSON.parse(getLocalStorageByItemName(sessionItems.shopCodes)) || [];
    let branchCodes = sessionShopCodes.filter((v,i,a)=>a.findIndex(t=>(t.branchCode===v.branchCode))===i);
    console.log('branch codes', branchCodes);
    return branchCodes;
  }

  return {
    getCartItems: getCartItems,
    setCartItems: setCartItems,
    getShopCodes: getShopCodes,
    setShopCodes: setShopCodes,
    getBranchCodes: getBranchCodes,
    updateCartItem: updateCartItem
  }

})();

export default SessionCartItems;

export var SessionUser = (function() {

  var getUserData = function() {
    let sessionUserItem =  JSON.parse(getLocalStorageByItemName(sessionItems.user)) || null;
    if (sessionUserItem) {      
      let barangay = barangays.find((a) => a.code == sessionUserItem.barangay).name;
      let municipal = municipalCodes.find((mun) => mun.id == sessionUserItem.municipal ).name;
      sessionUserItem.userAddress = sessionUserItem.street + ', ' + barangay + ', ' + municipal;
    }
    return sessionUserItem;    // Or pull this from cookie/localStorage
  };

  var setUserData = function(userData) {
    setLocalStorageByItemName(sessionItems.user, JSON.stringify(userData));
    // alert('success login');
  };

  var logoutUser = function () {
    localStorage.removeItem(sessionItems.user);
    localStorage.removeItem(sessionItems.cartItems);
    localStorage.removeItem(sessionItems.shopCodes);
  }

  var removeAllCartItems = function () {
    localStorage.removeItem(sessionItems.cartItems);
    localStorage.removeItem(sessionItems.shopCodes);
  }

  var userAddress = () => {
    return getUserData().street + ', ' + municipalCodes.find((a) => a.code === getUserData().barangay).name + ', ' + municipalCodes.find((a) => a.code === getUserData().municipal).name;
  }

  return {
    getUserData: getUserData,
    setUserData: setUserData,
    logoutUser: logoutUser,
    removeAllCartItems: removeAllCartItems,
    userAddress: userAddress 
  }

})();

// export UserSessionItem;

var setLocalStorageByItemName = (itemName, value) => {
    return localStorage.setItem(itemName, value);
}

var getLocalStorageByItemName = (itemName) => {
    return localStorage.getItem(itemName) || null;
}