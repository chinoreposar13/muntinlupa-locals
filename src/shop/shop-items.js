import './shop.css';
import hotAlien from '../assets/images/hot/Hot_alien.jpg';
import hotHusga from '../assets/images/hot/Hot_husga.jpg';
import hotXunli from '../assets/images/hot/Hot_xunli.jpg';

import { useParams } from "react-router";
import { Link } from 'react-router-dom';

import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import SessionCartItems from '../public/session.js'; 
import FbFunctions from '../firebase/funtions';
import { useState } from 'react';
import LoadingComponent from '../loading/loading';
const addToCart = (item) => {
  console.log('item', item);
  SessionCartItems.setCartItems(item);
}
const getShopDoc = async (shopCode) => {
  let shopDoc = (await FbFunctions.fbGetShopByCode(shopCode));
  return shopDoc;
}
const getShopItems = async (shopDocId) => {
  return await FbFunctions.fbGetItemsByShop(shopDocId);
}

var branchCodeDoc = async (branchCode) => {
  let returnData = await FbFunctions.fbGetBranchByCode(branchCode);
  console.log('ret', returnData);
  return returnData;
}
function ShopBrandItemsComponent() {
  const [onloadState, setonloadState] = useState(1);
  // const [brandItems, setBrandItems] = useState([]);
  const [branchDetails, setBranchDetails] = useState({});
  const [shopDetails, setShopDetails] = useState({});
  const categories = ['men', 'women', 'kids'];
  let { shopCode } = useParams();
  let { branchCode } = useParams();
  const [isLoading, setIsLoading] = useState(true);

    const [brandDesigns, setBrandDesigns] = useState([]);
    if (onloadState === 1) {
        branchCodeDoc(branchCode).then((branch) => {
          setBranchDetails(branch);
        });
        getShopDoc(shopCode).then((shop) => {
            setShopDetails(shop);

            //set shop items
            getShopItems(shop.id).then((shopItems) => {
              // setBrandItems(shopItems);
              setupShopItems(shopItems);
              
              setIsLoading(false);
            });
        });
        setonloadState(2);
    }
    var setupShopItems = (shopItems) => {
        if (shopItems.length > 0){
          let brandDesignsUi = [];
          categories.forEach((a) => brandDesignsUi[a] = []);
          shopItems.forEach(item => {
            brandDesignsUi[item.category].push(
                <Link to={'/shop/'+branchCode+'/brand/' + shopCode +'/item/' + item.code}>
                  <div class="col-lg-3 col-md-6 col-sm-12 mt-2 mr-1 brand-item-container">
                    <div className="brand-item-sale">
                      SALE
                    </div>
                    <Row>
                      <Col sm={12}>
                          <img className="brand-item-img" src={item.photo}/>
                      </Col>
                    </Row>
                    <Row className="brand-item-details">
                      <Col>
                        <Row>
                          <Col>
                                <span className="brand-item-name">{item.name}</span>
                          </Col>
                          <Col>
                                <span className="brand-item-colors">{item.colors}</span>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                                <span className="brand-item-price">P {item.price.toFixed(2)}</span>
                          </Col>
                        </Row>
                        {/* <Row>
                          <Col>
                          </Col>
                          <Col>
                          
                            <Link to="/cart">
                              <Button variant="secondary" size="sm" onClick={() => addToCart(item)}>
                                Add to Cart
                              </Button>
                            </Link>
                          </Col>
                        </Row> */}
                      </Col>
                    </Row>
                  </div>
                  </Link>
              );
          });
          setBrandDesigns(brandDesignsUi);
      }

      console.log(brandDesigns);
    }
    
    

    return (
    <div className="shop-container">
      
      {(() => {
            if (isLoading) {
                return (<LoadingComponent/>)
            }
        })()}
        <div className="row">
            <div className="col-6 left">
                <Link to={"/shop/" + branchCode}><span> {'< Back'}</span></Link>
            </div>
            <div className="col-6 align-right">

            </div>
        </div>
        <div>
            <h1>{shopDetails.name || ''}</h1>
        </div>
        <hr />
        <Tab.Container id="left-tabs-example" defaultActiveKey="Men">
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link  eventKey="disabled" disabled>CATEGORY</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="Men" className="categoryItemsLabel">Men</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="Women" className="categoryItemsLabel">Women</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="Kids" className="categoryItemsLabel">Kids</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content activeKey="Men">
                <Tab.Pane eventKey="Men" exact>
                  {brandDesigns['men']}
                </Tab.Pane>
                <Tab.Pane eventKey="Women">
                  {brandDesigns['women']}
                </Tab.Pane>
                <Tab.Pane eventKey="Kids">
                  {brandDesigns['kids']}
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
    </div>
    );
}

export default ShopBrandItemsComponent;
