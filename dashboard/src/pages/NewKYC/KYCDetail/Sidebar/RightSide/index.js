import React, {Component} from 'react';
import {MAP_KEYWORDS} from '../../../map_constant';
import {dateFormat} from '../../../../../utils';
import {path} from 'lodash/fp'
import './right-side-bar.scss';

class RightSideBar extends Component {
  messageFormat = (messageItem) => {
    switch (messageItem.message) {
        /**
		 * message: record-waiting
		 * triggers:
		 *      - when user submit data
		 */
      case 'record-waiting':
        return {status: '', msg: `Submitted`};
        /**
		 * message: record-start-review
		 * triggers:
		 *      - start review by reviewer
		 */
      case 'record-start-review':
        return {status: '', msg: `Start review`};
        /**
		 * message: field-decision
		 * triggers:
		 *      - decision on fields
		 */
      case 'field-decision':
        return {
          status: `${messageItem.extra.status === 'approved'
            ? 'Accepted'
            : 'Rejected'}`,
          msg: `${messageItem.extra.slug}`
        };
        /**
		 * message: record-feedback
		 * triggers:
		 *      - send feedback to user
		 */
      case 'record-feedback':
        return {status: '', msg: `Send feedback`};
        /**
		 * message: record-approve
		 * triggers:
		 *      - certificate sign and send to blockpass server
		 */
      default:
        return {status: '', msg: `Approve Profile`};
    }
  };

  render() {
    const {historyData, authors} = this.props;
    return historyData
      ? (
        <div
          className={`right-side ${this.props.open
          ? 'open'
          : 'hide'}`}>
          <h4 className="right-side__title">LATEST ACTIVITIES</h4>
          <div className="history-component">
            {historyData.map((item, index) => (
              <div className="history-component__item" key={`hist-${index}`}>
                <div className="history-component__item-date">
                  <span>{dateFormat(item.createdAt)}</span>
                </div>
                <div className="history-component__item-info">
                  <p className="history-component__item-detail">
                    <span
                      className={`history-component__item-status ${this
                      .messageFormat(item)
                      .status
                      .toLowerCase()}`}>
                      {this
                        .messageFormat(item)
                        .status}
                    </span>
                    <span>
                      {MAP_KEYWORDS[
                        this
                          .messageFormat(item)
                          .msg
                      ] || this
                        .messageFormat(item)
                        .msg}
                    </span>
                  </p>
                  <p className="history-component__item-detail author">
                    by {authors[path(['extra', 'by'])(item)] || 'user'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
      : (
        <h4>No record found</h4>
      );
  }
}

export default RightSideBar;
