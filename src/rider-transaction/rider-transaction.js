/*global google*/
import * as React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useCallback } from 'react';
import { Col, Row } from 'react-bootstrap';

import { useParams } from 'react-router-dom';
import FbFunctions from '../firebase/funtions';
import LoadingComponent from '../loading/loading';
import { Link } from 'react-router-dom';


import './rider-transaction.css';
import './map.css';

import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '80vh',
  height: '80vh'
};

const center = {
  lat: -3.745,
  lng: -38.523
};


var getTransactionByTransactionNo = async (transactionNumber) => { 
    let userTransaction = await FbFunctions.fbGetOrderByRefNo(transactionNumber);
    console.log('usertransactions', userTransaction);
    return userTransaction;
}

export default function RiderTransactionComponent() {
    const [currentLocation, setCurrentLocation] = useState({});
    let {transNumberUrl} = useParams();
    
    const [isLoading, setIsLoading] = useState(true);
    const [onloadState, setonloadState] = useState(1);
    
    const [orderDropOff, setOrderDropOff] = useState({lat: 14.418197, lng: 121.04211});


    const [transNumber, settransNumber] = useState('');
    const [subtotalprice, setsubtotalprice] = useState('');
    const [deliveryprice, setdeliveryprice] = useState('');
    const [customerName, setcustomerName] = useState(''); 
    const [deliveryAddress, setdeliveryAddress] = useState(''); 
    const [branchLocation, setBranchLocation] = useState({lat: 14.397420, lng: 121.033051}); 
    

    const getOrderLocation = async () => {
        return await getTransactionByTransactionNo(transNumberUrl);
    }


    if (onloadState === 1) {
        getOrderLocation().then(async (order) => {
            setOrderDropOff({lat: Number(order.lat), lng: Number(order.long)});
            
            settransNumber(transNumberUrl);
            setsubtotalprice(order.subtotal_price);
            setdeliveryprice(order.delivery_price);
            setcustomerName(order.fullname);
            setdeliveryAddress(order.delivery_address);
            setdeliveryAddress(order.delivery_address);
            setIsLoading(false);
            getLocation();
          
            let branchCode = JSON.parse(order.shop_codes)[0].branchCode;
            let branchDetails = await FbFunctions.fbGetBranchByCode(branchCode);
            setBranchLocation({lat: branchDetails.lat, lng: branchDetails.long, name: branchDetails.name});
            // window.setInterval(window.location = '/rider/order/'+transNumberUrl, 20000);
            
        });
        setonloadState(2);
    }
  

    function getLocation() {
        setIsLoading(true);
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(showPosition);
        //   
        } else { 
        }
        setIsLoading(false);
      }
      
      function showPosition(position) {
        // x.innerHTML = "Latitude: " + position.coords.latitude + 
        // "<br>Longitude: " + position.coords.longitude;
        console.log('position', position);
        setCurrentLocation({lat: position.coords.latitude, lng: position.coords.longitude })
      }



    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyB3HPYOpt1oPOtiOhuyGl565m6ZP7YauPA"
      })
    
      const [map, setMap] = useState(null);
    
      const onLoad = useCallback(function callback(map) {
        // const directionsService = new window.google.maps.DirectionsService();
        // const directionsRenderer = new window.google.maps.DirectionsRenderer();

        const bounds = new window.google.maps.LatLngBounds();
        map.fitBounds(bounds);
        setMap(map)
        
        // calculateAndDisplayRoute(directionsService, directionsRenderer);
        // calculateAndDisplayRoute(directionsService);
      }, [])
    
      const onUnmount = useCallback(function callback(map) {
        setMap(null)
      }, [])

    
      function calculateAndDisplayRoute(directionsService) {
    // function calculateAndDisplayRoute(directionsService, directionsRenderer) {
        const waypts = [];
    
        directionsService
        .route({
            origin: 'montreal, quebec',
            destination: 'Vancouver, BC',
            waypoints: waypts,
            optimizeWaypoints: true,
            travelMode: window.google.maps.TravelMode.DRIVING,
        })
        .then((response) => {
            // directionsRenderer.setDirections(response);
    
            const route = response.routes[0];
            // const summaryPanel = document.getElementById("directions-panel");
    
            // summaryPanel.innerHTML = "";
    
            // For each route, display summary information.
            for (let i = 0; i < route.legs.length; i++) {
            const routeSegment = i + 1;
    
            // summaryPanel.innerHTML +=
            //     "<b>Route Segment: " + routeSegment + "</b><br>";
            // summaryPanel.innerHTML += route.legs[i].start_address + " to ";
            // summaryPanel.innerHTML += route.legs[i].end_address + "<br>";
            // summaryPanel.innerHTML += route.legs[i].distance.text + "<br><br>";
            }
            console.log('routeeeeeee', route);
        })
        .catch((e) => window.alert("Directions request failed due to "));
    }
      const customerHouse = "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";

      return isLoaded ? (
        
        <div className="center" style={{width: '80vh', height: '80vh'}}>
        <h1>MAP DELIVERY</h1>
        {(() => {
          if (isLoading) {
            return (<LoadingComponent />)
          }
        })()}
        
        <div className="col-6 left">
                <Link to={'/admin/orders/'+transNumberUrl}><span> {'< Back'}</span></Link>
            </div>
        <Row className="mb-4">
            <Col sm={4} lg={4}>
                <span>Reference Number: <b>{transNumber}</b></span> <br/>
                <span>Customer: <b>{customerName}</b></span>
            </Col>
            <Col sm={4} lg={4}>
                <span>Address: <b>{deliveryAddress}</b></span><br/>
                
                
            </Col>
            <Col sm={4} lg={4}>
                <span>Item Total Price : <b>P {subtotalprice}</b></span><br/>
                <span>Delivery Price: <b>{deliveryprice}</b></span>
            </Col>
        </Row>
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={currentLocation}
            zoom={15}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
              <Marker key="current" position={currentLocation} label={'Current Position'}></Marker>
              <Marker key="branch" position={branchLocation} label={branchLocation && branchLocation.name + ' Branch'}></Marker>
              <Marker key="dropoff" position={orderDropOff} label={'Customer\'s House' }  icon={customerHouse}></Marker>
            <Polyline   
                geodesic={true}
                options={{
                    path: [branchLocation, orderDropOff],
                    strokeColor: '#00ffff',
                    strokeOpacity: 1,
                    strokeWeight: 6,
                    icons: [{
                        offset: '0',
                        repeat: '10px'
                    }],
                }}
        />
            { /* Child components, such as markers, info windows, etc. */ }
            <></>
          </GoogleMap>
    </div>
      ) : <></>
   
}