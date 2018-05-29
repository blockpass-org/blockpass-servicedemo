import React from 'react';
import defaultImage from './default-avatar.png';
import '../infor-item.scss';

const ImageItem = ({ data = defaultImage, status, zoomInEvt }) => (
	<div
		style={{
			backgroundColor: `${status === 'approved'
				? '#e0ecff'
				: status === 'rejected' ? '#ffe0e0' : ''}`,
			borderRadius: '4px',
		}}
		className={`infor-item image ${status}`}
	>
		<div
			className='image-wrapper'
		>
			<div
				style={{
					backgroundImage: `url(${data})`,
					backgroundSize: 'cover',
					backgroundRepeat: 'no-repeat',
					backgroundPositionX: 'center'
				}}
				className="infor-item__image"
				onClick={(e) => zoomInEvt()}
			/>
		</div>
	</div>
);
export default ImageItem;
