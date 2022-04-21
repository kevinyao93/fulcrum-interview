import React, {useState, useEffect} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import './IssueModal.css';


function IssueModal(props) {
    const defaultForm = {
        'name': '',
        'description' : '',
        'mat_cost': 0,
        'mat_quantity': 1,
        'quantity_selection': 'meter',
        'labor_cost': 0,
        'total_cost': 0,
    }
    const [formState, setFormState] = useState(defaultForm);

    // Check if modal is new issue or editing a current one
    const isNewIssue = Object.entries(props.currIssue).length === 0;

    // Fill in the modal with exisitng issue if is edit
    useEffect(() => {
        if (!isNewIssue) {
            setFormState(props.currIssue);
        } else {
            setFormState(defaultForm);
        }
    }, [props.currIssue])
    
    // Create or edit issue when form is selected
    const submitForm = e => {
        e.preventDefault()
        if (Object.entries(props.currIssue).length === 0) {
            props.addIssue({...formState, 'id': props.currId});
            props.setCurrId(props.currId+1);
        } else {
            props.editIssue(formState.id, formState);
        }
        setFormState(defaultForm);
        props.handleClose();
    }

    // Update the current issue when any field changes
    const onInput = (e, target) => {
        let curr_form = formState
        if (target == 'quantity_selection') {
            // Toggle the value of the amount depending on size of material
            let mat_cost = formState.mat_cost
            if (e.target.value == 'feet') {
                mat_cost = (mat_cost * 3.28084).toFixed(2)
            } else {
                mat_cost = (mat_cost * 0.3048).toFixed(2)
            }
            curr_form.mat_cost = mat_cost
        }
        // Update the current object and calculate the total cost
        curr_form[target] = e.target.value;
        curr_form.total_cost = (parseFloat(curr_form.labor_cost) + parseFloat(curr_form.mat_cost * curr_form.mat_quantity)).toFixed(2);
        setFormState(prevState => ({
            ...prevState, 
            [target]: e.target.value,
            'total_cost': curr_form.total_cost,
            'mat_cost': curr_form.mat_cost,
        }));
    }
    
    return (
        <Modal
            show={props.showModal}
            onHide={props.handleClose}
            size="lg"
        >
            <Modal.Header closeButton>
                {!isNewIssue ? <Modal.Title>Edit Issue</Modal.Title> : <Modal.Title>New Issue</Modal.Title>}
                
            </Modal.Header>
            <Modal.Body>
                <Form id="issue-form" onSubmit={submitForm}>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>Issue Name</Form.Label>
                        <Col sm={8}>
                            <Form.Control 
                                required
                                defaultValue={formState.name}
                                type="text" 
                                onChange={e => onInput(e, 'name')}
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" >
                        <Form.Label>Issue Description</Form.Label>
                        <Col sm={11}>
                            <Form.Control 
                                defaultValue={formState.description}
                                as="textarea" 
                                rows={2} 
                                onChange={e => onInput(e, 'description')}
                            />
                        </Col>

                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={3}>Material Cost: </Form.Label>
                        <Col sm={3}>
                            <Form.Control 
                                value={formState.mat_cost}
                                type="number" 
                                onChange={e => onInput(e, 'mat_cost')}
                            />
                        </Col>
                        <Col sm={3}>
                            <Form.Check
                                type="radio"
                                label="per meter"
                                name="quantity_selection"
                                className="meter_radio"
                                value="meter"
                                checked={formState.quantity_selection == 'meter'}
                                onChange={e => onInput(e, 'quantity_selection')}
                            />
                        </Col>
                        <Col sm={2}>
                            <Form.Check
                                type="radio"
                                label="per foot"
                                name="quantity_selection"
                                value="feet"
                                checked={formState.quantity_selection == 'feet'}
                                onChange={e => onInput(e, 'quantity_selection')}
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={3}>Material Quantity:</Form.Label>
                        <Col sm={3}>
                            <Form.Control 
                                type="number" 
                                value={formState.mat_quantity}
                                onChange={e => onInput(e, 'mat_quantity')}
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={3}>Labor Cost:</Form.Label>
                        <Col sm={3}>
                            <Form.Control 
                                type="number" 
                                value={formState.labor_cost}
                                onChange={e => onInput(e, 'labor_cost')}
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={3}>Total Cost:</Form.Label>
                        <Col sm={3}>
                            <Form.Control
                                disabled
                                name='total_cost'
                                type="number" 
                                value={formState.total_cost}
                            />
                        </Col>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                {!isNewIssue &&
                    <Button variant="danger" onClick={() => props.deleteIssues([formState.id])}>
                    Delete
                    </Button>
                }
                <Button variant="primary" type="submit" form="issue-form">
                    {!isNewIssue ? "Edit" : "Submit"}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default IssueModal