import React, {Component, Fragment} from 'react';
import {inject} from 'mobx-react';
import {path, keys, assoc, reverse} from 'lodash/fp';
import {MAP_KEYS, CONFIG_MODEL} from '../map_constant';
import {Button, Modal, message, Row, Col} from 'antd';
import {translatePictureUrl, dateFormat, certStandalize} from '../../../utils';
import './KYCDetail.scss';
import '../../../components/StoryBookComponents/index.scss';
import KYCUserCardInfo from './KYCUserCardInfo';
import KYCBlockpassInfo from './KYCBlockpassInfo';
import KYCCertificateInfo from './KYCCertificateInfo';
import {LeftSideBar, RightSideBar} from './Sidebar';
import {renderModal} from './components/Modal';

@inject('ApplicationStore')
export default class KYCDetail extends Component {
  state = {
    loading: false,
    status: 'waiting',
    userID: '',
    userEmail: '',
    checkID: () => this.reviewID(),
    certificateItemCount: 0,
    // data: [],
    profileItemCount: 0,
    evtHandler: {
      showModal: (title, type) => this._showModal(title, type)
    },
    dataCert: [],
    reviewEvt: (id) => this._reviewCertificateEvt(id),
    submitReason: '',
    authors: {},
    reSubmitData: []
  };

  /**
 * action when click button review certificate (for demo version)
 * @param  {object} rawData certificate rawData
 */

  _reviewCertificateEvt = (rawData) => {
    const codeDialogStyle = {
      height: 'auto',
      maxHeight: '500px',
      overflow: 'auto',
      backgroundColor: '#eeeeee',
      wordBreak: 'normal!important',
      wordBrap: 'normal !important',
      whiteSpace: 'pre !important'
    };

    Modal.info({
      title: 'Certificate Review', width: 750, content: <pre style={codeDialogStyle}>{JSON.stringify(rawData, null, 2)}</pre>,
      className: 'modal-info-antd'
    });
  };

  /**
 * start review calling
 */

  async reviewID() {
    const {ApplicationStore} = this.props;
    const startReviewProcess = await ApplicationStore.startReview(this.state.userID, 'beginning review');

    if (!startReviewProcess) {
      return this._showError('server error');
    }
    this._fetchData();
  }
  /**
 * show error
 *
 */
  _showError(msg) {
    message.warning(msg);
  }

  /**
 * fetch KYCModel and KYCLog of Profile from API
 *
 */

  async _fetchData() {
    const {ApplicationStore} = this.props;
    const _id = this._id;

    const res = await ApplicationStore.restQueryData('KYCModel', CONFIG_MODEL.KYCModel(_id));

    if (res === null || res.body.length === 0) {
      return this._showError('Data not found!');
    } else {
      const history = (await this._fetchHistory()) || {
        body: []
      };
      if (history) {
        const data = res.body[0];
        const historyData = history.body;

        const profileData = keys(data.identities).reduce((profile, curr) => {
          const logData = this._checkLogData({log: historyData, reviews: data.reviews, category: curr, type: MAP_KEYS[curr].type, isWaitingUserResubmit: data.waitingUserResubmit});
          profile[curr] = this._updateFieldStatus({
            ...MAP_KEYS[curr],
            history: logData,
            keyName: curr,
            dataValue: MAP_KEYS[curr].type === 'image'
              ? translatePictureUrl(path(['identities', curr])(data))
              : path(['identities', curr])(data)
          }, path(['reviews', curr, 'status'])(data), path('status')(data));

          return profile;
        }, {});
        const certificateData = this._certificateDataHandle(data.certs);
        this.setState({
          profileData,
          userID: data._id,
          userEmail: path(['identities', 'email'])(data),
          status: data.status,
          waitingUserResubmit: data.waitingUserResubmit
        });
        this.setState({dataCert: certificateData, certificateItemCount: certificateData.length});
        this._historyHandel(historyData);
        this.setState({history: historyData});
      }
    }
  }

  /**
 * fetch KYCLog of Profile from API
 *
 */

  async _fetchHistory() {
    const {ApplicationStore} = this.props;
    const _id = this._id;
    const history = await ApplicationStore.restQueryData('LogModel', CONFIG_MODEL.LOGModel(_id));

    if (history === null || history.body.length === 0) {
      return;
    } else {
      return history;
    }
  }

  /**
 * handle certificate data
 *
 * @param  {object} certs certificate data
 */

  _certificateDataHandle = (certs) => {
    const certsData = Object
      .keys(certs)
      .map((item) => {
        let result;
        try {
          result = JSON.parse(certs[item]);
        } catch (e) {
          result = null;
        }
        return result;
      });
    const tmp = certsData.map((item) => certStandalize(item));
    console.log(tmp);
    return tmp;
  };

  /**
 * handle data history
 *
 * @param  {object} history history of this profile
 *
 */

  _historyHandel = (history) => {
    const author = [...new Set(history.map((item) => path(['extra', 'by'])(item)).filter(Boolean))];
    author.forEach((item) => {
      this._getUsername(item);
    });
    const checkResubmit = history.filter((item) => item.message === 'record-waiting').some((item) => path(['extra', 'submitCount'])(item) > 1) && path(['0', 'message'])(history) !== 'record-approve';
    if (checkResubmit) {
      let reSubmitData = this.state.reSubmitData;
      const changeLogs = path(['0', 'extra', 'changeLogs'])(history.filter((item) => item.message === 'record-waiting'));
      if (!reSubmitData.length) {
        reSubmitData = changeLogs.map((item) => ({keyName: item.slug, value: item.new}));
      } else {
        reSubmitData = reSubmitData.filter((item) => changeLogs.some((submitData) => submitData.slug === item.keyName)).map((item) => ({
          ...item,
          value: path(['new'])(changeLogs.find((data) => data.slug === item.keyName))
        }));
      }
      this.setState({reSubmitData});
    } else 
      this.setState({reSubmitData: []});
    }
  ;

  /**
 * get username base on id
 *
 * @param  {string} id id of user
 *
 */

  async _getUsername(id) {
    const {ApplicationStore} = this.props;
    const userName = await ApplicationStore.getUsername(id);
    this.setState({
      authors: assoc(id, path(['body', 'userName'])(userName))(this.state.authors)
    });
  }

  /**
 * take action approve certificate
 *
 */

  async approveCertificate() {
    const {ApplicationStore} = this.props;
    const {profileData} = this.state;
    const data = keys(profileData).map((item) => ({slug: item, comment: profileData[item].reason, status: profileData[item].status, type: 'identities'}));
    const reviewProcess = await ApplicationStore.approveCertificate(this.state.userID, this.state.submitReason, data);

    if (reviewProcess && path([
      'body',
      'cer',
      'data',
      'bpSignRes',
      'res',
      'status'
    ])(reviewProcess) === 'success') {
      this.setState({modal: '', submitReason: ''});
      message.success('your profile has been certificated !');
      this
        .props
        .history
        .push('/');
    }
  }

  /**
 * take action send feedback to server
 *
 */

  async sendFeedback() {
    const {ApplicationStore} = this.props;
    const {profileData} = this.state;
    const data = keys(profileData).map((item) => ({slug: item, comment: profileData[item].reason, status: profileData[item].status, type: 'identities'}));

    const reviewProcess = await ApplicationStore.sendFeedback(this.state.userID, this.state.submitReason, data);
    if (reviewProcess) {
      message.success('your feedback has been sent !');
      this.setState({modal: '', submitReason: ''});
      return Promise.all([this._fetchData()]);
    }
  }

  componentDidMount() {
    const {match} = this.props;
    this._id = match.params.id;
    this._fetchData();
  }

  /**
 * get log history of field in profile
 *
 * @param  {array} log Log file after fetching history from API
 * @param  {string} category keyName of Field
 *
 * @return {array}  array of log field
 *
 */

  _getLogStory = ({
    log = [],
    category = ''
  }) => log.map((item) => {
    if (item.message === 'field-decision' && path(['extra', 'slug'])(item) === category) {
      const getLogField = (field) => path(['extra', field])(item);
      return {
        status: getLogField('status') || '',
        comment: getLogField('comment') || '',
        author: getLogField('by') || '',
        date: dateFormat(item.createdAt) || '',
        message: item.message || '',
        value: ''
      };
    } else if (item.message === 'record-waiting') {
      const fieldData = path(['extra', 'changeLogs'])(item).find((item) => item.slug === category);
      const checkFieldReSubmitted = path(['extra', 'changeLogs'])(item).some((item) => item.slug === category);
      if (checkFieldReSubmitted) {
        return {
          status: 'submitted',
          comment: '',
          author: 'user',
          date: dateFormat(item.createdAt) || '',
          message: item.message || '',
          value: fieldData
            ? fieldData.new
            : ''
        };
      } else 
        return null;
      }
    else 
      return null;
    }
  ).filter(Boolean);

  /**
 * execute status for field data
 *
 * @param  {obj} fieldData the latest log data of this field
 * @param  {string} latestStatus the latest status of this field
 * @param  {string} profileStatus the status of profile
 *
 * @return {Obj}  Object of this field has status value
 *
 */

  _updateFieldStatus = (fieldData, latestStatus, profileStatus) => {
    const fieldHistory = path(['history', 'logStory'])(fieldData).filter((item) => item.message === 'field-decision');
    const lastSubmitData = path(['history', 'lastSubmitData'])(fieldData);
    const fieldStatus = fieldHistory.length > 0
      ? fieldHistory[0].status
      : 'submitted';
    const fieldComment = fieldHistory.length > 0
      ? fieldHistory[0].comment
      : '';
    if (profileStatus === 'approved') {
      return {
        ...fieldData,
        status: 'approved',
        reason: ''
      };
    }
    return {
      ...fieldData,
      status: latestStatus === 'received' && lastSubmitData
        ? 'submitted'
        : fieldStatus,
      reason: latestStatus === 'received' && lastSubmitData
        ? ''
        : fieldComment
    };
  };

  /**
 * get last submitted data from user of field in profile
 *
 * @param  {obj} lastSubmitData the latest log data of this field
 * @param  {string} category keyName of Field
 *
 * @return {Obj}  Object of last submitted of this field ( get null value when nothing changed in the last submitted)
 *
 */

  _getLatestSubmittedData = ({
    lastSubmitData,
    category,
    reviews,
    type,
    logStory,
    isWaitingUserResubmit
  }) => {
    if (path(['extra', 'submitCount'])(lastSubmitData) === 1 || !lastSubmitData) {
      return null;
    }
    const changeLog = path(['extra', 'changeLogs'])(lastSubmitData).find((item) => item.slug === category);
    if (changeLog) {
      const getLatestData = logStory.filter((item) => item.message === 'field-decision');

      // safeguard
      if (!getLatestData || getLatestData.length === 0)
        getLatestData = [
          {
            status: '',
            comment: ''
          }
        ];

      if (changeLog && changeLog.new !== changeLog.old) {
        return {
          ...reviews[category],
          status: getLatestData[isWaitingUserResubmit
              ? 1
              : 0].status,
          reason: getLatestData[isWaitingUserResubmit
              ? 1
              : 0].comment,
          value: type === 'image'
            ? translatePictureUrl(changeLog.old)
            : changeLog.old
        };
      } else 
        return null;
      }
    else 
      return null;
    }
  ;

  /**
 * get history data from user of field in profile
 *
 * @param  {array} log the current log data of this field
 * @param  {object} reviews Object of reviews data after fetching in KYCModel
 * @param  {string} category keyName of Field
 * @param  {string} type type of Field
 * @param  {boolean} isWaitingUserResubmit checking user resubmit
 *
 * @return {Obj}  Object of history of this field
 *
 */
  _checkLogData = ({log, reviews, category, type, isWaitingUserResubmit}) => {
    if (log.length === 0) 
      return {currentSubmitted: null, logStory: [], lastSubmitData: null};
    const currentSubmitted = path(['0', 'extra', 'submitCount'])(log.filter((item) => item.message === 'record-waiting').sort((cur, last) => cur.submitCount - last.submitCount));

    const logStory = reverse(this._getLogStory({log, category})).map((item, index, curArr) => {
      if (index === 0) {
        return item;
      } else {
        if (!item.value) {
          return {
            ...item,
            value: curArr[index - 1].value
          };
        } else 
          return item;
        }
      });
    const lastSubmitData = log.find((item) => item.message === 'record-waiting' && path(['extra', 'submitCount'])(item) === currentSubmitted);

    return {
      currentSubmitted,
      logStory: reverse(logStory),
      lastSubmitData: this._getLatestSubmittedData({
        lastSubmitData,
        reviews,
        category,
        type,
        logStory,
        isWaitingUserResubmit
      })
    };
  };

  /**
 * show modal
 *
 * @param  {string} title field item name
 * @param  {string} type type of modal
 *
 */

  _showModal = (title = '', type) => {
    if (type === 'approved') {
      const {profileData} = this.state;
      profileData[title] = {
        ...profileData[title],
        status: 'approved',
        reason: ''
      };
      this.setState({profileData});
    } else {
      this.setState({
        infoItemChecking: title
      }, () => renderModal({
        type,
        getModalValue: this._getModalValue,
        onSubmit: this._onSubmitHandle,
        itemChecking: title,
        nextEvt: this._nextEvt,
        skipEvt: this._skipEvt,
        history: type === 'history'
          ? this._getLogFieldData(this.state.profileData)(title)
          : ''
      }));
    }
  };

  /**
 * handle submit event
 *
 * @param  {string} type type of modal
 *
 */

  _onSubmitHandle = (type) => {
    switch (type) {
      case 'rejected':
        const {profileData, infoItemChecking, submitReason} = this.state;
        profileData[infoItemChecking] = {
          ...profileData[infoItemChecking],
          status: 'rejected',
          reason: submitReason
        };
        this.setState({profileData});
        break;
      case 'confirm':
        this._backEvt();
        break;
      case 'send-feedback':
        this.sendFeedback();
        break;
      default:
        this.approveCertificate();
    }
  };
  /**
 * handle review confirm event
 *
 */

  _nextEvt = () => renderModal({modalTitle: 'REVIEW CERTIFICATE', type: 'confirm', value: this.state.submitReason, onSubmit: this._onSubmitHandle, backEvt: this._backEvt});

  /**
 * handle back to approval form
 *
 */

  _backEvt = () => renderModal({
    type: 'approval',
    getModalValue: this._getModalValue,
    onSubmit: this._onSubmitHandle,
    value: this.state.submitReason,
    nextEvt: this._nextEvt,
    skipEvt: this._skipEvt
  });

  /**
 * handle skip process in approval form
 *
 */
  _skipEvt = () => renderModal({type: 'info', onSubmit: this._onSubmitHandle});

  /**
 * handle get reason in modal
 *
 * @param  {string} value value of reason in modal
 *
 */

  _getModalValue = (value) => this.setState({submitReason: value});

  /**
 * get history of field Item
 *
 * @param  {object} data profile data
 * @param  {object} category field name
 *
 */

  _getLogFieldData = (data = this.state.profileData) => (category = this.state.infoItemChecking) => data && category && path([category, 'history', 'logStory'])(data);

  render() {
    const {
      status,
      userID,
      userEmail,
      checkID,
      evtHandler,
      profileItemCount,
      dataCert,
      reviewEvt,
      certificateItemCount,
      history,
      profileData,
      waitingUserResubmit
    } = this.state;
    const {collapsed} = this.props;

    const profileCheckSideBarData = keys(profileData).map((item) => ({
      title: item,
      status: profileData[item].status === 'approved' || profileData[item].status === 'rejected'
        ? profileData[item].status
        : ''
    }));
    const feedBackDisableStatus = status === 'waiting' || waitingUserResubmit
      ? true
      : !(profileCheckSideBarData.every((item) => item.status === 'rejected' || item.status === 'approved') && !profileCheckSideBarData.every((item) => item.status === 'approved'));
    const approvalDisableStatus = status === 'waiting' || waitingUserResubmit
      ? true
      : !profileCheckSideBarData.every((item) => item.status === 'approved');
    return (userID && profileData && (
      <Row key="kyc-main">
        <Col span={4}>
          <LeftSideBar data={profileCheckSideBarData}/>
        </Col>
        <Col span={collapsed
          ? 14
          : 18} className="kyc-main">
          <div className="kyc-detail">
            <KYCUserCardInfo
              status={status}
              userID={userID}
              userEmail={userEmail}
              checkID={checkID}
              collapsed={this.props.collapsed}
              hasCerts={Object
              .keys(this.state.certs || {})
              .length > 0}/> {keys(this.state.profileData).length > 0 && (<KYCBlockpassInfo
              data={this.state.profileData}
              evtHandler={evtHandler}
              profileItemCount={profileItemCount}
              status={this.state.waitingUserResubmit
              ? 'waiting'
              : status}
              waitingUserResubmit={waitingUserResubmit}
              historyInfo={this.state.reSubmitData}/>)}
            {this.state.certificateItemCount > 0 && (<KYCCertificateInfo
              dataCert={dataCert}
              reviewEvt={reviewEvt}
              certificateItemCount={certificateItemCount}
              id={this.state.userID}/>)}
            <div
              className="kyc-process"
              style={{
              display: status === 'approved'
                ? 'none'
                : 'flex',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              {status !== 'approved' && (
                <Fragment>
                  <Button
                    className={`big blue ${feedBackDisableStatus
                    ? 'disabled'
                    : ''}`}
                    onClick={() => this._showModal('', 'send-feedback')}
                    disabled={feedBackDisableStatus}>
                    SEND FEEDBACK
                  </Button>
                  <Button
                    className={`big ${approvalDisableStatus
                    ? 'disabled'
                    : ''}`}
                    onClick={() => this._showModal('', 'approval')}
                    disabled={approvalDisableStatus}>
                    APPROVAL
                  </Button>
                </Fragment>
              )}
            </div>
          </div>
        </Col>
        <Col
          span={this.props.collapsed
          ? 6
          : 0}
          className="kyc-right-side">
          {< RightSideBar
          authors = {
            this.state.authors
          }
          open = {
            this.props.collapsed
          }
          historyData = {
            history
          }
          />}
        </Col>
      </Row>
    ));
  }
}
