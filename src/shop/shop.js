import './shop.css';
import InputGroup from 'react-bootstrap/InputGroup'
import { FormControl } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from 'react-bootstrap/Button';
import mlBrandLogo from '../assets/images/brands/logo.svg';
import tkBrandLogo from '../assets/images/brands/tk.jpg';
import dbtkBrandLogo from '../assets/images/brands/dbtk-logo-black.png';
import { Link } from 'react-router-dom';
import { useParams } from "react-router";
import FbFunctions from '../firebase/funtions';
import { useEffect, useState } from 'react';
import LoadingComponent from '../loading/loading';
var branchCodeDoc = async (branchCode) => {
    let returnData = await FbFunctions.fbGetBranchByCode(branchCode);
    console.log('ret', returnData);
    return returnData;
}
var getBrands = async (branchId) => {
    return (await FbFunctions.fbGetBrandsByBranch(branchId));
}
function ShopComponent() {
    const [onloadState, setonloadState] = useState(1);
    let { branchCode } = useParams();

    const [branchDetails, setBranchDetails] = useState({});
    const [brands, setBrands] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
  
    if (onloadState === 1) {
        branchCodeDoc(branchCode).then((a)=> {
            setBranchDetails(a);
            getBrands(a.id).then((a)=> {
                setBrands(a);
                console.log(a);
                setIsLoading(false);
            });

            
        });
        setonloadState(2);
    }
  

    // getBrands().then((a)=> {
    //     setBrands(a);
    //     // console.log('data', a);
    // });

    // const branchList = [
    //     {
    //         id:1,
    //         code: 'tunasanBranch',
    //         name: 'Tunasan, Muntinlupa'
    //     },
    //     {
    //         id:2,
    //         code: 'putatanBranch',
    //         name: 'Putatan, Muntinlupa'
    //     }
    // ];  

    // const brands = [
    //     {
    //         id:1,
    //         code: 'mntlpLocals',
    //         name: 'Muntinlupa Locals',
    //         logo: mlBrandLogo
    //     },
    //     {
    //         id:2,
    //         code: 'thirstyKiddos',
    //         name: 'Thirsty Kiddos Co.',
    //         logo: tkBrandLogo
    //     },
    //     {
    //         id:4,
    //         code: 'dbtk',
    //         name: 'DBTK',
    //         logo: dbtkBrandLogo
    //     }
    //     // ,
    //     // {
    //     //     id:2,
    //     //     code: 'thirstyKiddos',
    //     //     name: 'Thirsty Kiddos Co.',
    //     //     logo: tkBrandLogo
    //     // },
    //     // {
    //     //     id:4,
    //     //     code: 'dbtk',
    //     //     name: 'DBTK',
    //     //     logo: dbtkBrandLogo
    //     // },
    //     // {
    //     //     id:1,
    //     //     code: 'mntlpLocals',
    //     //     name: 'Muntinlupa Locals',
    //     //     logo: mlBrandLogo
    //     // },
    //     // {
    //     //     id:4,
    //     //     code: 'dbtk',
    //     //     name: 'DBTK',
    //     //     logo: dbtkBrandLogo
    //     // },
    // ];  
    const brandDesigns = [];
    if (brands.length > 0){
        brands.forEach(brand => {
        
            brandDesigns.push(
                <Link to={'/shop/'+ branchCode +'/brand/' + brand.code}>
                    <div class="col-lg-3 col-md-6 col-sm-12 mt-2 mr-1 brand-item-container">
                        <img src={brand.logo}/>
                        {/* <span className="brand-name">{brand.name}</span> */}
                    </div>
                </Link>
            );
        });
    }

    // <img src={logo} className="banner-logo fade-in-image"></img>

    return (
    <div className="shop-container">
        
        {(() => {
            if (isLoading) {
                return (<LoadingComponent/>)
            }
        })()}
        <div>
            <h1>Brands available here in {branchDetails.name || ''} Branch</h1>
        </div>
        <div>
            <span className="shop-title-description">Choose your favorite brand!</span>
        </div>
        <hr />
        <div className="row brand-container mt-5">
            {brandDesigns}
        </div>
    </div>
    );
}

export default ShopComponent;