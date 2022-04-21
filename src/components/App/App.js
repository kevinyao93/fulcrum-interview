import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';

import IssueManager from '../IssueManager/IssueManager';

import "./App.css";

function App() {
    const [createIssue, setCreateIssue] = useState(false)

    return (
        <div  >
            {createIssue ? 
                <IssueManager />
            :
                <div className="d-grid gap-2" id="est_button">
                    <Button size="lg" onClick={() => setCreateIssue(true)}>Create Estimate</Button>
                </div>
            }
        </div>
    )
}

export default App