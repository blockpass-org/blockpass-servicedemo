import React from 'react';
import { Timeline } from 'antd';
import moment from 'moment';

const ACTION_COLOR_MAP = {
    undefined: 'blue',
    reject: 'red',
    approved: 'green'
}

class UserActivityHistory extends React.PureComponent {
    render() {
        const {history} = this.props;

        if(!history || history.length === 0) return <div>Nothing to display...</div>

        return <Timeline>
            {history.map((itm, i) => <Timeline.Item 
                color={ACTION_COLOR_MAP[itm.extra.action]}
                key={i}>
                    <p> {itm.message} </p>
                    <p style={{color:'grey'}} > {moment(itm.createdAt).fromNow()} </p>
                </Timeline.Item>)
            }
        </Timeline>
    }
}

export default UserActivityHistory;