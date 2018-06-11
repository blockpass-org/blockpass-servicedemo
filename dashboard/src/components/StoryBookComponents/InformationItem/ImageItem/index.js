import React from 'react';
import defaultImage from './default-avatar.png';
import '../infor-item.scss';

const ImageItem = ({ data = defaultImage, status, zoomEvt }) => (
	<div
		style={{
			backgroundColor: `${status === 'approved' ? '#e0ecff' : status === 'rejected' ? '#ffe0e0' : ''}`,
			borderRadius: '4px'
		}}
		className={`infor-item image ${status}`}
	>
		<div className="image-wrapper">
			<div
				style={{
					backgroundImage: `url(${data})`,
					backgroundSize: 'cover',
					backgroundRepeat: 'no-repeat',
					backgroundPositionX: 'center',
					cursor: zoomEvt ? 'zoom-in' : 'default'
				}}
				className="infor-item__image"
				onClick={(e) => (zoomEvt ? zoomEvt() : false)}
			/>
		</div>
	</div>
);
export default ImageItem;
