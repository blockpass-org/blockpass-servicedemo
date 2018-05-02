import React, { PureComponent } from 'react';
import { Table } from 'antd';

class DataEntitiesTable extends PureComponent {

    render() {
        const {columns, data} = this.props
        return (
            <Table columns={columns} dataSource={data} />
        );
    }
}

export default DataEntitiesTable;