import React from 'react';
import CertificateList from '../../../../components/StoryBookComponents/CertificateList';

const KYCCertificateInfo = ({dataCert, reviewEvt, certificateItemCount, id}) => (certificateItemCount > 0 && <div className="kyc-process">
  <div className="kyc-process__profile__title">
    Certificates({certificateItemCount})
  </div>
  <div className="kyc-process__profile__content">
    <CertificateList data={dataCert} reviewEvt={reviewEvt} id={id}/>
  </div>
</div>);

export default KYCCertificateInfo;
