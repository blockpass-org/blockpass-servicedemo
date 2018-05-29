export const MAP_KEYWORDS = {
	passport: 'Passport',
	dob: 'Date of birth',
	lastName: 'Family name',
	firstName: 'Given name',
	phone: 'Phone',
	address: 'Address',
	postalCode: 'Postal Code',
	picture: 'Picture',
	proofOfAddress: 'Proof Of Address',
	email: 'Email'
};

export const CONFIG_MODEL = {
	KYCModel: (_id) => ({
		query: {
			_id
		}
	}),
	LOGModel: (_id) => ({
		query: {
			recordId: _id
		},
		sort: {
			createdAt: -1
		},
		select: {
			type: 1,
			message: 1,
			extra: 1,
			createdAt: 1
		},
		limit: 50,
		skip: 0
	}),
	CertificateModel: (_id) => ({
		query: {
			userId: _id
		},
		sort: {
			createdAt: -1
		},
		select: {
			type: 1,
			data: 1,
			rate: 1,
			expiredAt: 1,
			createdAt: 1
		},
		limit: 1
	})
};

export const MAP_KEYS = {
	firstName: {
		title: 'Given Name',
		category: 'name',
		type: 'text'
	},
	lastName: {
		title: 'Family Name',
		category: 'name',
		type: 'text'
	},
	phone: {
		title: 'Phone',
		category: 'phone',
		type: 'text'
	},
	email: {
		title: 'Email',
		category: 'email',
		type: 'text'
	},
	address: {
		title: 'Street & Number',
		category: 'address',
		type: 'text'
	},
	city: {
		title: 'City',
		category: 'address',
		type: 'text'
	},
	country: {
		title: 'Country',
		category: 'address',
		type: 'text'
	},
	state: {
		title: 'State',
		category: 'address',
		type: 'text'
	},
	postalCode: {
		title: 'Postal Code',
		category: 'address',
		type: 'text'
	},
	dob: {
		title: 'Date of Birth',
		category: 'dob',
		type: 'text'
	},
	passport: {
		title: 'Passport',
		category: 'passport',
		type: 'image'
	},
	picture: {
		title: 'Selfie',
		category: 'picture',
		type: 'image'
	},
	proofOfAddress: {
		title: 'Proof of Address',
		category: 'proofOfAddress',
		type: 'image'
	}
};

export const MAP_ADDRESS_ORDER = [
	{
		title: 'ADDRESS',
		keyName: 'address'
	},
	{
		title: 'CITY',
		keyName: 'city'
	},
	{
		title: 'STATE',
		keyName: 'state'
	},
	{
		title: 'COUNTRY',
		keyName: 'country'
	},
	{
		title: 'POSTAL CODE',
		keyName: 'postalCode'
	}
];
