import moment from 'moment';
function _isNewFormat(certObj) {
	return certObj.Organization && certObj.Claim && certObj.Entity;
}

export default function certStandalize(rawCert) {
	let certObj = rawCert;
	if (typeof rawCert === 'string') {
		try {
			certObj = JSON.parse(rawCert);
		} catch (err) {
			console.error(err);
			return {
				title: 'error',
				avtUrl: null,
				issueDate: '',
				status: '',
				_rawCert: {}
			};
		}
	}

	if (_isNewFormat(certObj)) {
		const { Organization, Claim } = certObj;
		return {
			title: Organization.legalName,
			avtUrl: Organization.logo,
			issueDate: moment(Claim.issueDate).format('DD MMMM YYYY'),
			status: Claim.reviewBody,
			_rawCert: certObj
		};
	} else {
		// old format
		const { onfido_report } = certObj;

		return {
			title: `Onfido (Expired)`,
			avtUrl:
				'https://asia-api.blockpass.org/api/private/image/onfido_cert_thumbnail.png',
			issueDate: moment(onfido_report.created_at).format('DD MMMM YYYY'),
			status: onfido_report.result,
			_rawCert: certObj
		};
	}
}
