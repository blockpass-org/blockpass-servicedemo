import React from 'react';
import { Card, Rate } from 'antd';
import moment from 'moment';

const DEFAULT_URL = `${process.env.PUBLIC_URL}/verify_badge.png`

class CertificateDisplay extends React.PureComponent {
    render() {
        const { imgUrl, itm } = this.props;
        const endDate = moment(itm.expiredAt).format('DD-MMMM-YYYY');
        return <Card
            hoverable
            style={{ width: 200, padding: 5}}
            cover={<img alt="example" src={imgUrl || DEFAULT_URL} />}
        >
            <Card.Meta
            title={(
                <Rate defaultValue={itm.rate} count={5} disabled={true} style={{ fontSize: 16 }} />
            )}
            description={`Until: ${endDate}`}
            />
        </Card>
    }
}

export default CertificateDisplay;