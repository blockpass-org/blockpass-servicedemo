import React from 'react';

// Test Comp
import ReviewDisplay from '../../pages/KYC/components/ReviewDisplay';

const style = {
    marginTop: '25px',
    padding: '8px',
    background: '#fbfbfb',
    border: '1px solid #d9d9d9',
    borderRadius: '6px'
}

export default class QuickTest extends React.Component {

    render() {
        return <div>
            <ReviewDisplay/>
        </div>
    }
}