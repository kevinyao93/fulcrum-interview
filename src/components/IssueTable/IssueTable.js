import React, {useState, useEffect} from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import './IssueTable.css';

function IssueTable(props) {
    const [tables, setTables] = useState([])
    // Default checks are set to false (unchecked)
    const [deleteCheck, setDeleteCheck] = useState(new Array(props.issues.length).fill(false))
    const [costSums, setCostSums] = useState({'mat': 0, 'labor': 0, 'total': 0}) 

    const hasChecked = deleteCheck.some(function(ele) {
        return ele === true;
    })
    // Update the check array with the correct index
    function toggleDelete(index) {
        let updatedArray = [...deleteCheck];
        updatedArray[index] = !updatedArray[index]
        setDeleteCheck(updatedArray);
    }

    // Delete all selected checks within the array
    function onDelete() {
        let delete_ids = [];
        for (let i = 0; i < deleteCheck.length; i++) {
            if (deleteCheck[i] == true) {
                delete_ids.push(props.issues[i].id);
            }
        }
        props.deleteIssues(delete_ids);
    }

    // Create row with the issue
    function mapRow(issue, index) {
        return (
            <tr key={index}>
                <td onClick={() => props.openIssue(issue.id)}>{issue.id}</td>
                <td onClick={() => props.openIssue(issue.id)}>{issue.name}</td>
                <td onClick={() => props.openIssue(issue.id)}>{(issue.mat_cost * issue.mat_quantity).toFixed(2)}</td>
                <td onClick={() => props.openIssue(issue.id)}>{issue.labor_cost}</td>
                <td onClick={() => props.openIssue(issue.id)}>{issue.total_cost}</td>
                <td>
                    <Form.Check 
                        onChange={() => toggleDelete(index)}
                        checked={deleteCheck[index] || false}
                        type="checkbox" 
                        id={issue.id}
                    />
                </td>
            </tr>
        )
    }

    // Update the table when the checkbox is selected
    useEffect(() => {
        const updatedTable = props.issues.map((issue, index) => mapRow(issue, index))
        setTables(updatedTable);
    }, [deleteCheck]);

    // Update the table and sums when issues are updated.
    useEffect(() => {
        const updatedTable = props.issues.map((issue, index) => mapRow(issue, index));
        let currSums = {'mat': 0, 'labor': 0, 'total': 0};
        for (let i = 0; i < props.issues.length; i++) {
            let cur_issue = props.issues[i];
            currSums.mat = parseFloat(currSums.mat) + (parseFloat(cur_issue.mat_cost) * parseFloat(cur_issue.mat_quantity));
            currSums.labor = parseFloat(currSums.labor) + parseFloat(cur_issue.labor_cost);
            currSums.total = parseFloat(currSums.total) + parseFloat(cur_issue.total_cost);
        }
        setCostSums(currSums);
        setDeleteCheck(new Array(props.issues.length).fill(false));
        setTables(updatedTable);
    }, [props.issues])
    return (
        <div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th> ID</th>
                        <th>Name</th>
                        <th>Material Cost</th>
                        <th>Labor Cost</th>
                        <th>Total Cost</th>
                        <th className="noPadding">
                            <Button 
                                disabled={!hasChecked}
                                id="delete_button"
                                size="sm" 
                                variant="danger"
                                onClick={() => onDelete()}
                            >
                                Delete Selected
                            </Button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {tables}
                    {tables.length > 0 &&
                        <tr>
                            <td />
                            <td>Total Cost </td>
                            <td>{costSums.mat.toFixed(2)}</td>
                            <td>{costSums.labor.toFixed(2)}</td>
                            <td>{costSums.total.toFixed(2)}</td>
                            <td>
                                <Button
                                    size="sm" 
                                    variant="primary"
                                    onClick={() => alert("Issue Total Cost " + costSums.total.toFixed(2))}
                                >
                                    Save
                                </Button>
                            </td>
                        </tr>
                    }   
                </tbody>
            </Table>
        </div>
    )
}

export default IssueTable