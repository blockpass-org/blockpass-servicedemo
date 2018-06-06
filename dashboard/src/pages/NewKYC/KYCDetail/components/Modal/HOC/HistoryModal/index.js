import React from 'react';
import enhanceModal from '../../enhancer';
import BodyHistoryModal from '../../Partials/BodyModal/BodyHistoryModal';

const HistoryHeader = ({ title }) => (
	<div className="modal-header__wrapper">
		<p className="modal-header__title">{title}</p>
	</div>
);

const WrapperModal = enhanceModal({
	header: HistoryHeader,
	body: BodyHistoryModal
})();

const HistoryModal = (props) => <WrapperModal {...props} />;
export default HistoryModal;
