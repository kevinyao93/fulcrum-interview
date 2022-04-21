import React, {useState, useEffect} from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import NavDropdown from 'react-bootstrap/NavDropdown';


import IssueTable from '../IssueTable/IssueTable';
import IssueModal from '../IssueModal/IssueModal';

import './IssueManager.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function IssueManager() {
  const [issues, setIssues] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currId, setCurrId] = useState(1);
  const [currIssue, setCurrIssue] = useState({});

  // Open and close modal to add and edit issues
  const handleClose = () => setShowModal(false);
  const handleOpen = () => setShowModal(true);

  // Add issue into the existing set of issues
  function addIssue(issue) {
    setIssues([...issues, issue])
  }

  // Using the issue ID, update the issue with the contents of the inputed issue
  function editIssue(id, issue) {
    const index = issues.findIndex(item => item.id === id);
    let updatedIssues = issues;
    updatedIssues[index] = issue;
    setIssues(updatedIssues);
  }

  // Allow for editing of the issue when item is selected
  function openIssue(issue_id) {
    let issue = issues.find(iss => {
      return iss.id === issue_id
    })
    setCurrIssue(issue)
    handleOpen();
  }

  // Delete all issues that are contained with the issue_id array
  function deleteIssues(issue_ids) {
    let updatedIssues = issues.filter(issue => {
      return !issue_ids.includes(issue.id)
    })
    setIssues(updatedIssues);
    handleClose();
  }

  // Generate a random issue for testing
  function createRandomIssue() {
    console.log("in random");
    const mat_cost = (Math.random() * 1000).toFixed(2);
    const mat_quantity = Math.floor(Math.random() * (50));
    const labor_cost = (Math.random() * 1000).toFixed(2);
    const total_cost = (parseFloat(mat_cost * mat_quantity) + parseFloat(labor_cost)).toFixed(2);
    const randomIssue = {
      'id': currId,
      'name': 'Random Issue',
      'description' : 'Random Issue Description',
      'mat_cost': mat_cost,
      'mat_quantity': mat_quantity,
      'quantity_selection': 'meter',
      'labor_cost': labor_cost,
      'total_cost': total_cost,
    }
    setCurrId(currId + 1);
    addIssue(randomIssue);
  }

  // When modal is closed, reset the current issue
  useEffect(() => {
    if(showModal === false) {
      setCurrIssue({});
    }
  }, [showModal])

  return (
    <div className="IssueManager">
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="#home">Issue Manager</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={handleOpen}>Create New Line Item</Nav.Link>
              <Nav.Link onClick={createRandomIssue}>Create Random Line Item</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <IssueModal 
        editIssue={editIssue}
        showModal={showModal}
        handleOpen={handleOpen}
        handleClose={handleClose}
        addIssue={addIssue}
        currId={currId}
        currIssue={currIssue}
        setCurrId={setCurrId}
        deleteIssues={deleteIssues}
      />

      <IssueTable 
        openIssue={openIssue}
        issues={issues}
        showModal={showModal}
        handleOpen={handleOpen}
        handleClose={handleClose}
        deleteIssues={deleteIssues}
      />
    </div>
  );
}

export default IssueManager;
