import './login.css';
import InputGroup from 'react-bootstrap/InputGroup'
import { Form, FormControl } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from 'react-bootstrap/Button';
import FbFunctions, {Login} from '../firebase/funtions';
import { useState } from 'react';
import { SessionUser } from '../public/session';
import LoadingComponent from '../loading/loading';
import { userTypes } from '../public/models';

function isAuthenticated() {
    if (SessionUser.getUserData()) {
        let userType = SessionUser.getUserData().userType;
        switch(userType) {
            case userTypes.user:
                window.location = "/home";
                break;
            default:
                window.location = "/admin/orders";
                break;
        }
    }
};
function LoginComponent() {
    isAuthenticated();

    var [isLoading, setIsLoading] = useState(false);
    const [validated, setValidated] = useState(false);
    const [accountValidation, setAccountValidation] = useState(true);
    return (
    <div className="login-container">
        {(() => {
            console.log(isLoading);
            if (!isLoading) {
                return (
                <Form validated={validated} onSubmit={login} name="formSignup">
                <div className="container-box">
                                <div className="mb-10">
                                    <h1>Log in to Your Account</h1>
                                    </div>
                                    <hr/>
                                    <InputGroup className="mb-4" size="lg">
                                        <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1">
                                            <FontAwesomeIcon icon="user"/>
                                        </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                        placeholder="Username"
                                        aria-label="Username"
                                        aria-describedby="basic-addon1"
                                        required
                                        id="username"
                                        />
                                    </InputGroup>
                                    <InputGroup className="mb-4" size="lg">
                                        <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon2">
                                            <FontAwesomeIcon icon="lock" />
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                        placeholder="Password"
                                        aria-label="Password"
                                        aria-describedby="basic-addon2"
                                        required
                                        type="password"
                                        id="password"
                                        />
                                    </InputGroup>
                                    {
                                        (() => {
                                            if(!accountValidation) {
                                                return(<label className="text-danger">The username/password you've entered is incorrect</label>);
                                            }
                                        })()
                                    }
                                    <div className="mb-4 login-remember-container">
                                        <Button variant="dark" size="lg" className="btn-login" type="submit">Login</Button>
                                    </div>
                                    <hr/>
                                    <h5>Doesn't have an account? <a href="/signup">Sign up here.</a></h5>
                            </div>
                    </Form>
                )
            } else {
                return(<LoadingComponent />);
            }
        })()
        }
    </div>
    );

    function acceptLogin(userData) {
        SessionUser.setUserData(userData);
        isAuthenticated();
    }
    
    async function login(e) {
        e.preventDefault();
        // handle admin usertype
        // window.location.href='admin/dashboard';
        setIsLoading(true);
        // console.log('fb users', await FbFunctions.fbGetUsers());
        // console.log('fb user 1', await FbFunctions.fbFindById(0));
        // console.log('ispresent 1',await FbFunctions.fbIsPresentById(1));
        // console.log('!ispresent 2',await FbFunctions.fbIsPresentById(2));
        // FbFunctions.fbSaveUser();

        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        const {username, password} = e.target.elements;
        let userData = await FbFunctions.fbLogin(username.value, password.value);
        if (userData && !!userData.username) {
            console.log('userData', userData);
            let mappedUserData = {
                username: userData.username,
                userType: userData.userType,
                docId: userData.id,
                firstName: userData.firstname,
                lastName: userData.lastname,
                email: userData.email,
                municipal: userData.municipal,
                barangay: userData.barangay,
                contact: userData.contact,
                street: userData.street,
                adminBranch: userData.adminBranch || ''
            };
            acceptLogin(mappedUserData);
        } else {
            setAccountValidation(false);
            setIsLoading(false);
        }
        setValidated(true);
        return;
    }

}

export default LoginComponent;