import React from 'react';
import {flow} from 'lodash/fp';
import {Modal} from 'antd';

export const withHeader = (Header) => (WrapComponent = Modal) => (props) => Header
  ? (<WrapComponent
    title={Header({
    title: props.modalTitle,
    description: props.modalDescription,
    type: props.type,
    backEvt: props.backEvt,
    close: props.close,
    value: props.value,
    onSubmit: props.onSubmit
  })}
    {...props}/>)
  : (<WrapComponent {...props}/>);

export const withContent = (Body, Footer) => (WrapComponent = Modal) => (props) => (
  <WrapComponent {...props} footer={null}>
    {Body && (<Body
      value={props.value}
      textEvtHandle={props.textEvtHandle}
      tooltips={props.tooltips}
      history={props.history}
      backEvt={props.backEvt}
      close={props.close}/>)}
    {Footer && (<Footer
      disable={props.disable}
      onSubmit={props.onSubmit}
      type={props.type}
      onCancel={props.onCancel}
      close={props.close}
      reviewValue={props.value}
      nextEvt={props.nextEvt}
      skipEvt={props.skipEvt}/>)}
  </WrapComponent>
);

const enhanceModal = ({
  header,
  body = null,
  footer = null
}) => (ModalComponent = Modal) => flow(withHeader(header), withContent(body, footer))(ModalComponent);

export default enhanceModal;
