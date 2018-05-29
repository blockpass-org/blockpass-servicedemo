import React, { Fragment} from 'react';
import {Steps, CheckingIDStep} from '../../../../components/StoryBookComponents';

const KYCUserCardInfo = (props) => <Fragment>
        <div className="kyc-process waiting-review">
          <div className="kyc-process__waiting-review__step">
            <Steps status={props.status}/>
          </div>
        </div>
        <div className="kyc-process__waiting-review__information">
          <CheckingIDStep {...props} collapsed={props.collapsed}/>
        </div>
      </Fragment>

export default KYCUserCardInfo