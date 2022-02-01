
import { TextField } from '@mui/material';
import * as React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { formDataToJson } from '../../../assets/generalFunctions';

export default function AdminBranchesNewComponent() {
    const pathName = window.location.pathname || '';
    let pageName = pathName.includes('new') ? 'Create New Branch': 'Edit Branch';

    function handleSubmit(event) {
        console.log('submit')
        const data = new FormData(event.target);
        console.log(formDataToJson(data));
        event.preventDefault();
    }
    
    return (
    <div className="admin-branches-container">
        <h1>{pageName}</h1>
        <form onSubmit={handleSubmit}>
            <div className="form-container center">
            <Row>
                <Col>
                    <Row className="mb-3">
                        <Col sm={6}>
                            <TextField
                                required
                                id="code"
                                label="Code (Ex. tunasanBranch)"
                                name="code"
                                fullWidth 
                            />
                        </Col>
                        <Col sm={6}>
                            <TextField
                                required
                                id="name"
                                label="Name (Ex: Tunasan Branch)"
                                name="name"
                                fullWidth 
                            />
                        </Col>
                    </Row>
                    <Row  className="mb-3">
                        <Col sm={12}>
                            <TextField
                                required
                                id="location"
                                label="Location (Ex. Parkhomes Subv., Brgy. Tunasan, Muntinlupa)"
                                name="location"
                                multiline
                                maxRows={4}
                                rows={4}
                                fullWidth 
                            />
                        </Col>
                    </Row>
          
                </Col>
            </Row>
            </div>
            <Button variant="dark" size="md" type="submit">SUBMIT</Button>
        </form>
    </div>
    );

}