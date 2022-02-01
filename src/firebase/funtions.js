import { userTypes } from "../public/models";
import API from "./api";

const fbCollections = {
    users: 'Users',
    branch: 'Branch',
    product: 'Product',
    shop: 'Shop',
    checkOut: 'CheckOut'

}


const FbFunctions = (() => {

    const fbGetUsers = async () => {
        return await API.getList(fbCollections.users);
    }

    const fbFindById = async (id) => {
    return await API.findById(fbCollections.users, id);
    }
    const fbIsPresentById = async (id) => {
    return await API.isPresentById(fbCollections.users, id);
    }

    const fbSaveUser = async (data) => {
        return await API.saveData(fbCollections.users, data);
    }

    const fbLogin = async (username, password) => {
        let search = {username: username, password: password};
        return await API.customSearchDocument(fbCollections.users, search);
    }
    

    const fbFindByUsername = async (username) => {
        let search = {username: username};
        return await API.customSearchDocument(fbCollections.users, search);
    }
    
    const fbGetBranchByCode = async (branchCode) => {
        return await API.customSearchDocument(fbCollections.branch, {code: branchCode});
    }
    const fbGetBranches = async () => {
        return await API.customSearchDocList(fbCollections.branch, null);
    }
    const fbGetBrandsByBranch = async (branchCode) => {
        // let docReference = await API.findByDataDoc(fbCollections.branch, branchCode);
        // let brands = await API.customSearchDocList(fbCollections.shop, {branch_code: docReference});
        let brands = await API.customSearchListByDocReference(fbCollections.shop, fbCollections.branch, branchCode,'sort_order');
        return brands;
    }

    const fbGetShopByCode = async (shopCode) => {
        return await API.customSearchDocument(fbCollections.shop, {code: shopCode});
    }

    const fbGetItemsByShop = async (shopCode) => {
        let brands = await API.customSearchListByDocReference(fbCollections.product, fbCollections.shop, shopCode, 'sort_order');
        return brands;
    }

    const fbGetItemByCode = async (code) => {
        return await API.customSearchDocument(fbCollections.product, {code: code});
    }

    const fbGetCheckOutLastTransaction = async () => {
        return await API.getList(fbCollections.checkOut);
    }

    const fbCheckOutOrders = async (orderDetails) => {
        return await API.saveData(fbCollections.checkOut, orderDetails);
    }
    const fbGetCheckOutOrders = async (username) => {
        return await API.customSearchDocList(fbCollections.checkOut, {username: username});
    }
    const fbGetAllCheckOutOrders = async () => {
        return await API.customSearchDocList(fbCollections.checkOut);
    }
    const fbGetOrderByRefNo = async (transactionNumber) => {
        return await API.customSearchDocument(fbCollections.checkOut, {transactionNumber: transactionNumber});
    }

    const fbGetRiders = async () => {
        let search = {userType: userTypes.rider};
        return await API.customSearchDocList(fbCollections.users, search);
    }
    return ({
        fbGetUsers: fbGetUsers,
        fbFindById: fbFindById,
        fbIsPresentById: fbIsPresentById,
        fbSaveUser: fbSaveUser,
        fbLogin: fbLogin,
        fbFindByUsername: fbFindByUsername,
        fbGetBranches: fbGetBranches,
        fbGetBrandsByBranch: fbGetBrandsByBranch,
        fbGetBranchByCode: fbGetBranchByCode,
        fbGetItemsByShop: fbGetItemsByShop,
        fbGetShopByCode: fbGetShopByCode,
        fbGetItemByCode: fbGetItemByCode,
        fbGetCheckOutLastTransaction: fbGetCheckOutLastTransaction,
        fbCheckOutOrders: fbCheckOutOrders,
        fbGetCheckOutOrders: fbGetCheckOutOrders,
        fbGetAllCheckOutOrders: fbGetAllCheckOutOrders,
        fbGetOrderByRefNo: fbGetOrderByRefNo,
        fbGetRiders: fbGetRiders
    });
})();

export default FbFunctions;

const AdminFbFunctions = (() => {

    const updateStatus = async (docId, updateObject) => {
        return await API.updateDocumentByDoc(fbCollections.checkOut, docId, updateObject);
    }
    return ({
        updateStatus: updateStatus
    });
})();

export {AdminFbFunctions};
