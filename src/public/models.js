
var sessionItems = {
    cartItems:'cartItems',
    shopCodes: 'shopCodes',
    user: 'user',
};

const userTypes = {
    admin: 'admin',
    user: 'user',
    rider: 'rider'
  };
  

  
const municipalCodes = [
    {
        id: 'MUNTI',
        code: 'munti',
        name: 'Muntinlupa City'
    },
    {
        id: 'SPL',
        code: 'sanPedro',
        name: 'San Pedro City'
    },
];

const barangays = [
    {
        id: 'putatan',
        municipalId: 'MUNTI',
        code: 'putatan',
        name: 'Putatan'
    },
    {
        id: 'tunasan',
        municipalId: 'MUNTI',
        code: 'tunasan',
        name: 'Tunasan'
    },
    {
        id: 'sanAntonio',
        municipalId: 'SPL',
        code: 'sanAntonio',
        name: 'San Antonio'
    }
];

function convertCurrencyFormat(number) {
    return (Math.round(number * 100) / 100).toLocaleString();
}

const deliveryStatus = {
    pending: 'Pending',
    transit: 'In-Transit',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
}

function generateTransactionNumber(transactionNumber) {
    let series = transactionNumber + 1;
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var year = dateObj.getUTCFullYear();
    if (month < 10) {
        month = '0' + month;
    }
    return year + '-' + month + '-' + series;
}

export {userTypes, sessionItems, municipalCodes, barangays, convertCurrencyFormat, deliveryStatus, generateTransactionNumber};
  