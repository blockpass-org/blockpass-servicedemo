// https://ant.design/components/table/
import React, { PureComponent } from 'react';
import { Popconfirm, Divider } from 'antd';

// https://ant.design/components/table/#Column
const columns = [{
    title: 'Name',
    dataIndex: 'name',

    // Sort order & function
    defaultSortOrder: 'ascend',
    sorter: (a, b) => a.name.length - b.name.length,

    render: text => <b>{text}</b>,
},
{
    title: 'Age',
    dataIndex: 'age',
    width: '10%',
},
{
    title: 'Gender',
    dataIndex: 'gender',

    // Filterable values popup
    filters: [
        { text: 'Male', value: 'Male' },
        { text: 'Female', value: 'Female' },
    ],
    onFilter: (value, record) => record.gender.indexOf(value) === 0,
    width: '10%',
},
{
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
},
{
    title: 'Action',
    key: 'action',

    // Custom render actions
    render: (text, record) => (
        <div>
            <a href="#">Edit</a>
            <Divider type="vertical" />
            <Popconfirm title="Sure to delete?">
                <a href="#">Delete</a>
            </Popconfirm>
        </div>
    ),
}];

const data = [{
    key: '1',
    name: 'John Brown',
    age: 32,
    gender: 'Male',
    address: 'New York No. 1 Lake Park',
},
{
    key: '2',
    name: 'Jim Green',
    age: 42,
    gender: 'Male',
    address: 'London No. 1 Lake Park',
},
{
    key: '3',
    name: 'Joe Black',
    age: 32,
    gender: 'Female',
    address: 'Sidney No. 1 Lake Park',
}];

const dupData = data.concat(data).concat(data).concat(data).concat(data).concat(data).concat(data).concat(data);


export default {
    columns,
    data: dupData.map( (itm, i) => ({...itm, key: i}) )
};