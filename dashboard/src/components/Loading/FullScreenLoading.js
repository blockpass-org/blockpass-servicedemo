import React from 'react';
import { Spin, Icon } from 'antd';
import './style.css';

const antIcon = <Icon type="loading" style={{ fontSize: 45 }} spin />;

const FullScreenLoading = () => (
    <div className="fullScreenLoading">
        <Spin style={{margin: "auto"}} indicator={antIcon} />
    </div>
)

export default FullScreenLoading;