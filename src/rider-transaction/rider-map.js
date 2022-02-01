import React,{useState , useEffect} from 'react';
import GoogleMapReact from 'google-map-react';

export default function TheMap(props){
    const [cordinates , setCordinates] = useState(props);
    const MyCustomMarker = () => <span class="material-icons">place</span>;
    
    useEffect(() => {
       setCordinates(props);
   }, [props])
   
    return(
        <GoogleMapReact
            yesIWantToUseGoogleMapApiInternals
            bootstrapURLKeys={{key:'AIzaSyB3HPYOpt1oPOtiOhuyGl565m6ZP7YauPA'}}
            defaultZoom={16}
            center={cordinates.center}
        >
            <MyCustomMarker
                lat={cordinates.center[0]}
                lng={cordinates.center[1]}
            />
        </GoogleMapReact>
    )
}