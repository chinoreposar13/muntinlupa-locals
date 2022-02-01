import './branch.css';
import logo from '../assets/logo.svg';
import { Link } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import FbFunctions from '../firebase/funtions';
import { useState } from 'react';
import LoadingComponent from '../loading/loading';

var decodeLogo = (logobase) => {
    const type = logobase.split(';')[0].split('/')[1];
    return logobase;
}

var getBranches = async () => {
    let branches = await FbFunctions.fbGetBranches();
    // return  branches.map(item => item.logo = decodeLogo(item.logo));
    console.log('1111111111111111111111111111111');
    return  branches;
}
function BranchComponent() {
    const [onloadState, setonloadState] = useState(1);
    const [branchList, setBranchList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    if (onloadState === 1) {
        getBranches().then(branches => {
            setBranchList(branches);
            setIsLoading(false);
        });
        setonloadState(2);
    }
    let branches = [];
    if (branchList.length > 0){
        branchList.forEach(branch => {
        
            branches.push(
                
                <Link to={'/shop/' + branch.code} className="branches-link">
                <div class="col-lg-3 col-md-6 col-sm-12 mt-2 mr-1 branch-item-container">
                    <Row>
                        <Col sm={12}>
                            <img className="brand-item-img" src={branch.logo}/>
                            {/* <img className="brand-item-img" src={'data:image/svg+xml;base64,'+branch.logo}/> */}
                        </Col>
                    </Row>
                    <Row className="brand-item-details">
                        <Col>
                        <Row>
                            <Col>
                                <span className="brand-item-name">{branch.name} Branch</span>
                            </Col>
                        </Row>
                        </Col>
                    </Row>
                    </div>
                </Link>
            );
        });
    }
    // setIsLoading(false);
    // <img src={logo} className="banner-logo fade-in-image"></img>
    return (
    <div className="shop-container">
        {(() => {
            if (isLoading) {
                return (<LoadingComponent/>)
            }
        })()}
        
        <div>
            <h1>Our Branches</h1>
        </div>
        <div>
            <span className="shop-title-description">Choose your branch near you!</span>
        </div>
        <hr />
        <div className="row brand-container mt-5">
            {branches}
        </div>
    </div>
    );
}

export default BranchComponent;