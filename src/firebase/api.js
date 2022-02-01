import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, setDoc, updateDoc, where } from "firebase/firestore";
import firestore from "./config";

const API = (() => {

    function fsGetCollection(colName) {
        let fsCollection = collection(firestore, colName);
        return fsCollection;
    }
    
    async function getList(colName) {  
        const fsSnapshot = await getDocs(fsGetCollection(colName));
        const fsList = fsSnapshot.docs.map(doc => ({...doc.data(), id: doc.id})) || [];
        return fsList;
    }
    
    async function findById(colName, id) {
        const fsQuerySnapshot = query(fsGetCollection(colName), where("id", "==", id));
        const response = await getDocs(fsQuerySnapshot);
        let document = {};
        response.docs.map((i, key) => {
            if (key === 0) {
                document = i.data();
            }
        });
        return document;
    }

    async function customSearchDocList(colName, searchObject) {
        let documents = [];
        let fsQuerySnapshot = '';
        if (searchObject){
            let qWhere = [];
            Object.keys(searchObject).forEach((k) => {
                qWhere.push(where(k, '==', searchObject[k]));
            });
            fsQuerySnapshot = query(fsGetCollection(colName), ...qWhere);
            
        } else {
            fsQuerySnapshot = fsGetCollection(colName);
        }
        const response = await getDocs(fsQuerySnapshot);
        response.docs.map((i, key) => {
            documents.push({...i.data(), id: i.id});
        });
        return documents;
    }

    async function customSearchListByDocReference(colName, collectionReference, docId, sortBy) {
        let documents = [];
        let categoryDocRef = doc(firestore, collectionReference, docId);
        let documentReference = await getDoc(categoryDocRef);
        // , orderBy(sortBy, "asc") TODO
        let fsQuerySnapshot = query(fsGetCollection(colName), where(collectionReference, '==', documentReference.ref));
        const response = await getDocs(fsQuerySnapshot);
        response.docs.map((i, key) => {
            documents.push({...i.data(), id: i.id});
        });
        // console.log('documents', documents);
        return documents;
    }
    async function customSearchDocument(colName, searchObject) {
        let document = {};
        if (searchObject){
            let qWhere = [];
            Object.keys(searchObject).forEach((k) => {
                qWhere.push(where(k, '==', searchObject[k]));
            });
            const fsQuerySnapshot = query(fsGetCollection(colName), ...qWhere);
            const response = await getDocs(fsQuerySnapshot);
            response.docs.map((i, key) => {
                if (key === 0){
                    document = i.data();
                    document.id = i.id;
                }
            });
        }
        return document;
    }

    async function isPresentById(colName, id) {
        return await findById(colName, id) ? true : false;
    }



    async function findByDataDoc(colName, docId) {
        let col = fsGetCollection(colName, docId);
        return await getDoc(col);
    }

    async function saveData(colName, data) {
        // let savedData = {};
        const fsCollection = fsGetCollection(colName);  
        // savedData = await addDoc(fsCollection, data);
        let savedData = await addDoc(fsCollection, data);
        // if (!!data.id){
        //     savedData = await addDoc(fsCollection, data);
        // } else {
        // }

        console.log('api saved data', savedData);
        return savedData;
    }

    async function updateDocumentByDoc(colName, docId, updateFields) {
        // let fields = [];
        
        // Object.keys(updateFields).forEach((k) => {
        //     fields.push(where(k, '==', updateFields[k]));
        // });
        return await updateDoc(await doc(fsGetCollection(colName), docId), updateFields);
    }

    return ({
        getList: getList,
        findById: findById,
        isPresentById: isPresentById,
        saveData: saveData,
        customSearchDocument: customSearchDocument,
        customSearchDocList: customSearchDocList,
        findByDataDoc:findByDataDoc,
        customSearchListByDocReference: customSearchListByDocReference,
        updateDocumentByDoc: updateDocumentByDoc
    })
})();

export default API;