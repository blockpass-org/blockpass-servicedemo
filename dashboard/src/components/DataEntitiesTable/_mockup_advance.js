import React from 'react';
import { Tag } from 'antd';

export const columns = [{
    title: 'ID',
    dataIndex: '_id',
    customFilter: true
}, {
    title: 'UserName',
    dataIndex: 'userName',
    customFilter: true
}, {
    title: 'Scope',
    sorter: true,
    dataIndex: 'scope',
    render: (data) => {
        return <div>
            {data.map((itm, i) => <Tag key={i}>{itm}</Tag>)}
        </div>
    }
}];

export const datas = [{
    _id: 1,
    userName: "userA",
    scope: ['admin']
}, {
    _id: 2,
    userName: "userB",
    scope: ['mod', 'content']
}, {
    _id: 3,
    userName: "userD",
    scope: ['user']
}]

export const fakeResponse = {
    body: datas,
    headers: {
        'x-total-count': 3
    }
}