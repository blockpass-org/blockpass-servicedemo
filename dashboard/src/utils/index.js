import stores from '../stores';

export function translatePictureUrl(itm) {
	console.log(itm, 'uti');
	return stores.ApplicationStore.getStorageUrl(itm);
}

export function getObjectValueFromPath(obj, path) {
	return path.split('.').reduce((prev, curr) => {
		return prev ? prev[curr] : undefined;
	}, obj || {});
}

export function setTimeoutPromise(timeOutMs) {
	return new Promise((resolve, reject) => {
		setTimeout((_) => {
			resolve();
		}, timeOutMs);
	});
}

export function camelize(str) {
	return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
		if (+match === 0) return ''; // or if (/\s+/.test(match)) for white spaces
		return index === 0 ? match.toLowerCase() : match.toUpperCase();
	});
}

export function convertToMongoDbQuery({
	results,
	page,
	sortField,
	sortOrder,
	...filters
}) {
	let queryInfo = {};

	if (results !== undefined) {
		queryInfo = {
			...queryInfo,
			limit: results,
			skip: Math.max(0, page - 1) * results
		};
		const SORT_MAP = {
			descend: -1,
			ascend: 1
		};

		if (sortField) {
			if (sortOrder === null) sortOrder = 'ascend';
			queryInfo.sort = {
				[sortField]: SORT_MAP[sortOrder]
			};
		}
	}

	const filterLength = Object.keys(filters).length;
	if (filterLength) {
		queryInfo = {
			...queryInfo,
			query: {}
		};
	}

	Object.keys(filters).forEach((key) => {
		let val = filters[key];
		if (Array.isArray(val) && val.length > 0)
			queryInfo.query[key] = {
				$in: val
			};
		else if (key === '_id') queryInfo.query[key] = val;
		else
			queryInfo.query[key] = {
				$regex: `^${val}`
			};
	});

	return queryInfo;
}

export function extractUrl(url) {
	return (param) => {
		const par = url.substr(1).split('&');
		const params = par.map((item) => ({
			key: item.split('=')[0],
			value: item.split('=')[1]
		}));
		const resultItem = params.find((item) => item.key === param);
		return resultItem ? resultItem.value : false;
	};
}

export function dateFormat(dateString) {
	const date = new Date(dateString);
	const MONTH_KEYS = {
		0: 'January',
		1: 'February',
		2: 'March',
		3: 'April',
		4: 'May',
		5: 'June',
		6: 'July',
		7: 'August',
		8: 'September',
		9: 'October',
		10: 'November',
		11: 'December'
	};
	return `${date.getDate()} ${MONTH_KEYS[
		date.getMonth()
	]} ${date.getFullYear()}`;
};