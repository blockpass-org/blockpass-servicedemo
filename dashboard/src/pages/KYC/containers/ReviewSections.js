import React from 'react';
import { Tabs } from 'antd';
import ReviewDisplay from '../components/ReviewDisplay';

const TabPane = Tabs.TabPane;

class ReviewSections extends React.Component {
    state = {}

    render() {
        const { data, handleReview } = this.props;

        return <div>
            <Tabs
                defaultActiveKey="4"
                tabPosition="left"
            >
                <TabPane tab="1. Data Check(WIP)" key="1">
                    Check Data base one:
                    <p>1. Check hash of raw data equal Block Pass 's provided hash </p>
                    <p>2. From User fields hash -> calculate merkle tree root</p>
                    <p>3. Compare root hash with BlockChain </p>
                </TabPane>
                <TabPane tab="2. Certificate Check(WIP)" key="2">
                    Display user additional certificate
                    <p>1. Confirm certificate id with other services </p>
                    <p>2. Display certificate info </p>
                </TabPane>
                <TabPane tab="3. Interview(optional)" key="3">
                    Phone call interview with user ?
                </TabPane>
                <TabPane tab="4. SmartContract" key="4">
                    <ReviewDisplay
                        handleSubmit={handleReview}
                        data={{
                            ...data,
                        }}
                    />
                </TabPane>
            </Tabs>
        </div>
    }
}

export default ReviewSections;