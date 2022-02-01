import './signup.css';
import InputGroup from 'react-bootstrap/InputGroup'
import { Form, FormControl } from 'react-bootstrap';
import TextField from '@mui/material/TextField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";

import { Col, Row } from "react-bootstrap";
import FbFunctions from '../firebase/funtions';
import { userTypes, municipalCodes, barangays } from '../public/models';
import { SessionUser } from '../public/session';

function SignupComponent() {

    const [barangayCodes, setBarangays] = useState(barangays);
    const [barangayState, setBarangayState] = useState(true);
    const [validated, setValidated] = useState(false);

    const [mapVisible, setMapvisible] = useState(false);
    const [confirmValidation, setConfirmValidation] = useState(true);
    const [userValidation, setUserValidation] = useState(true);

    async function signUpSubmit(event) {
        event.preventDefault();
        const form = event.currentTarget;
            if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            }
            
        const {username, 
                password, 
                firstname,
                lastname,
                street,
                barangay,
                municipal,
                contact,
                email,
                confirmPassword} = event.target.elements;

            //form  validation
            if(confirmPassword.value !== password.value) {
                setConfirmValidation(false);
                event.preventDefault();
            }

            let signupData = {username: username.value, 
                password: password.value, 
                firstname: firstname.value ,
                lastname: lastname.value ,
                street: street.value ,
                barangay: barangay.value ,
                municipal: municipal.value ,
                contact: contact.value ,
                email: email.value,
                confirmPassword: confirmPassword.value,
                userType: userTypes.user};

            let userData = await FbFunctions.fbFindByUsername(signupData.username);
            
            console.log('getuser', userData);
            event.preventDefault();
            if (!!userData.username){ 
                alert('Username is already used');
                setUserValidation(false);
                event.preventDefault();
            } else {
                // submit signup
                let userData = await FbFunctions.fbSaveUser(signupData);
                alert('Successful signup!');
                console.log('userData', userData);
                let userSessionData = {
                    username: signupData.username,
                    userType: signupData.userType,
                    docId: userData.id,
                    firstName: signupData.firstname,
                    lastName: signupData.lastname,
                    email: signupData.email,
                    barangay: signupData.barangay ,
                    municipal: signupData.municipal ,
                    street: signupData.street ,
                };
                SessionUser.setUserData(userSessionData);
                window.location = '/home';
            }
            setValidated(true);
            
    };

    let currentLat = '';
    let currentLong = '';
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            currentLat = position.coords.latitude;
            currentLong = position.coords.longitude;
        });
    }
    const PinAddressMap = withScriptjs(withGoogleMap(() =>
                <GoogleMap defaultZoom={18} defaultCenter={{ lat: currentLat, lng: currentLong }} apiKey>
                    <Marker position={{ lat: currentLat, lng: currentLong }} />
                </GoogleMap>
    ));

    const GoogleMapComponent = (data) => {
            console.log(data);
        let pinAddressUi = '';
        if (!!data.isVisible) {
            pinAddressUi =(
                <PinAddressMap 
                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyB3HPYOpt1oPOtiOhuyGl565m6ZP7YauPA&v=3.exp&libraries=geometry,drawing,places"
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div className="map-container" onClick={()=>setMapvisible(false)} />}
                mapElement={<div  className='map' />} />
                );
        }
        return pinAddressUi;

    };

    const selectMunicipal = (e) => {
        const filteredBarangay = barangays.filter((b) => b.municipalId === e.target.value);
        setBarangayState(false);
        setBarangays(filteredBarangay);
    };

    return (
    <div className="login-container">
        <div className="container-box">
        <div className="mb-10 signup-header">
        <h1>Sign up</h1>
        <h6>Please fill up this form to create an account.</h6>
        </div>
        <hr />
        <Form validated={validated} onSubmit={signUpSubmit} name="formSignup">
        <div className="row left">
            <div className="col-6">
            <label>First Name</label>
            <InputGroup className="mb-4" size="lg">
                <FormControl
                placeholder="First Name"
                aria-label="firstname"
                aria-describedby="basic-addon6"
                required
                id="firstname"
                />
            </InputGroup>
            </div>
            <div className="col-6">
            <label>Last Name</label>
                <InputGroup className="mb-4" size="lg">
                    <FormControl
                    placeholder="Last Name"
                    aria-label="lastname"
                    aria-describedby="basic-addon6"
                    required
                    id="lastname"
                    />
                </InputGroup>
            </div>
            <div className="col-12">
                <Row>
                    <Col sm={6}>
                    <label>Municipality</label>
                    <InputGroup className="mb-4" size="xl">
                        <TextField
                            id="municipal"
                            fullWidth 
                            select
                            onChange={selectMunicipal}
                            SelectProps={{
                                native: true,
                            }}
                            required
                            >
                            <option disabled>Select Municipal</option>
                            {municipalCodes.map((option, key) => (
                                <option key={option.id} value={option.id}>
                                {option.name}
                                </option>
                            ))}
                        </TextField>
                    </InputGroup>
                    </Col>
                    <Col sm={6}>
                    <label>Barangay</label>
                    <InputGroup className="mb-4" size="xl">
                        <TextField
                            fullWidth
                            id="barangay"
                            select
                            // onChange={handleChange}
                            disabled={barangayState}
                            SelectProps={{
                                native: true,
                            }}
                            required
                            >
                            <option disabled value="">Select Barangay</option>
                            {barangayCodes.map((option, key) => (
                                <option key={option.id} value={option.id}>
                                {option.name}
                                </option>
                            ))}
                        </TextField>
                    </InputGroup>
                    </Col>
                    <Col sm={12}>
                    
                    <label>Block/Lot/House No./Street</label>
                    <InputGroup className="mb-4" size="lg">
                        <InputGroup.Prepend>
                        <InputGroup.Text id="basic-addon2">
                            <FontAwesomeIcon icon="map-marked-alt"/>
                        </InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                        placeholder="Block/Lot/House No./Street"
                        aria-label="Block/Lot/House No./Street"
                        aria-describedby="basic-addon2"
                        required
                        id="street"
                        />
                    </InputGroup>
                    </Col>
                </Row>
                
            {/* <label>Pin Address</label>
                <InputGroup className="mb-4" size="lg"  onClick={()=>setMapvisible(true)}>
                    <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon2">
                        <FontAwesomeIcon icon="map-marked-alt"/>
                    </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                    placeholder="Pin Address"
                    aria-label="PinAddress"
                    aria-describedby="basic-addon2"
                    required
                    />
                </InputGroup> */}
            </div>
            
            <div className="col-12">
            <label>Contact Number</label>
                <InputGroup className="mb-4" size="lg">
                    <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon2">
                        <FontAwesomeIcon icon="phone"/>
                    </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                    placeholder="Contact number"
                    aria-label="Contact"
                    aria-describedby="basic-addon2"
                    required
                    id="contact"
                    />
                </InputGroup>
            </div>
            <div className="col-12">
            <label>Email</label>
                <InputGroup className="mb-4" size="lg">
                    <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon3">
                        <FontAwesomeIcon icon="envelope"/>
                    </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                    placeholder="Email"
                    aria-label="Email"
                    aria-describedby="basic-addon4"
                    type="email"
                    required
                    id="email"
                    />
                </InputGroup>
            </div>
            <div className="col-12">
            <label>Username</label>
                <InputGroup className="mb-4" size="lg">
                    <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon5">
                        <FontAwesomeIcon icon="user"/>
                    </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                    placeholder="Username"
                    aria-label="Username"
                    aria-describedby="basic-addon5"
                    id="username"
                    onChange={()=> setUserValidation(true)}
                    required
                    />
                </InputGroup>
                <label hidden={userValidation} className="text-danger">Username was already used.</label>
            </div>
            <div className="col-12">
            <label>Password</label>
                <InputGroup className="mb-4" size="lg">
                    <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon6">
                        <FontAwesomeIcon icon="lock" />
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                    placeholder="Password"
                    aria-label="Password"
                    aria-describedby="basic-addon7"
                    type="password"
                    id="password"
                    required
                    />
                </InputGroup>
            </div>
            <div className="col-12">
            <label>Confirm Password</label>
                <InputGroup className="mb-4" size="lg">
                    <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon6">
                        <FontAwesomeIcon icon="lock" />
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                    placeholder="Confirm Password"
                    aria-label="ConfirmPassword"
                    aria-describedby="basic-addon7"
                    type="password"
                    id="confirmPassword"
                    onChange={()=> setConfirmValidation(true)}
                    required
                    />
                </InputGroup>
                <label hidden={confirmValidation} className="text-danger">Confirm Password is not the same</label>
            </div>
        </div>
        <div className="mb-4 login-remember-container">
            <Button variant="dark" size="lg" className="btn-login" type="submit">Sign up</Button>
        </div>
        </Form>
        <hr/>
        <h5>Have an account? <a href="/login">Login here.</a></h5>
        </div>
       {/* <GoogleMapComponent isVisible={mapVisible}/>  */}
    </div>
    );
}

export default SignupComponent;