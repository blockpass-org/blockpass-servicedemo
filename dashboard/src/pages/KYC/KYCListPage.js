import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Tag } from "antd";
import { inject } from 'mobx-react';
import DataEntitiesTableAdvance from '../../components/DataEntitiesTable/DataEntitiesTableAdvance';

const MODEL_NAME = 'KYCModel';
const selectFields = {
    '_id': 1,
    'status': 1,
    'identities': 1
}
const STATUS_COLOR_MAPPING = {
    'approved': '#87d068',
    'inreview': 'blue',
    'waiting': 'yellow'
}

const columns = [{
    title: 'ID',
    dataIndex: '_id',
    customFilter: true,
    render: (data) => {
        return <div>
            {data.slice(0, 5) + '...'}
        </div>
    },
    width: '20%'
}, {
    title: 'FirstName',
    dataIndex: 'identities.fristName',
    customFilter: true
}, {
    title: 'LastName',
    dataIndex: 'identities.lastName',
}, {
    title: 'Status',
    dataIndex: 'status',
    filters: [
        { text: 'Waiting', value: 'waiting' },
        { text: 'InReview', value: 'inreview' },
        { text: 'Approved', value: 'approved' },
    ],
    render: (data) => {
        return <div>
            <Tag color={STATUS_COLOR_MAPPING[data]}>{data}</Tag>
        </div>
    }
}, {
    title: 'Action',
    key: 'action',

    render: (text, record) => (
        <div>
            <Link to={`/kyc/detail/${record._id}`}>Edit</Link>
        </div>
    ),
}];

@inject("ApplicationStore")
export default class UserPage extends Component {

    _refreshData = async (queryModel) => {
        const { ApplicationStore } = this.props;
        queryModel = {
            ...queryModel,
            query: {
                ...queryModel.query
            }
        }

        // apply select fields
        return await ApplicationStore.restQueryData(MODEL_NAME, {
            ...queryModel,
            select: selectFields,
            sort: {status: -1}
        });
    }

    render() {
        return <div>
            <DataEntitiesTableAdvance columns={columns} refreshData={this._refreshData} />
        </div>
    }
}