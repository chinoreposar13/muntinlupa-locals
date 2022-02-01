import './footer.css';

function Footer() {

    return (
        <div className="footer-container">
            <div className="row">
                <div className="col-md-4 ">
                    <h6>LOCAL BRANCHES</h6> 
                    <div>Putatan, Muntinlupa (MAIN)</div>
                    <div>Tunasan, Muntinlupa</div>
                    <div>Alabang, Muntinlupa</div>
                </div>
                <div className="col-md-4">
                    <h6>SOCIAL MEDIA ACCOUNTS</h6>
                    <div>Facebook: Muntinlupa Locals</div>
                    <div>Instagram: @muntinlupa_locals</div>
                    <div>Twitter: @Muntinlupa_Locals</div>

                </div>
                <div className="col-md-4">

                    <h6>CONTACT INFORMATION</h6>
                    <div>Globe: 0917-888-8888</div>
                    <div>Smart: 0941-888-8888</div>
                </div>
            </div>
        </div>
    );

}

export default Footer;