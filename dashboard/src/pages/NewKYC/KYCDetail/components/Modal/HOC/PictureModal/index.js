import React from 'react';
import enhanceModal from '../../enhancer';
import { Modal } from 'antd';
import { BodyWithImage } from '../../Partials';

const WrapperComponent = enhanceModal({ body: BodyWithImage })(Modal);

const ImageModal = (props) => <WrapperComponent {...props} maskClosable={false} />;

export default ImageModal;
