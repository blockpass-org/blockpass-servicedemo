import { action, observable } from 'mobx';
import request from 'superagent';
import api from './_api';

export default class ApplicationStore {
	constructor(auth) {
		this._auth = auth;
		this.querySetting();
	}
	isDev = process.env.REACT_APP_ENV !== 'production';
	@observable isLoading = false;
	@observable hostUrl = process.env.REACT_APP_API_HOST || '';
	@observable appSetting = [];

	getStorageUrl(id) {
		return api.kycStorageItem(this.hostUrl, id);
	}

	@action
	async login(userName, pass) {
		this.showLoading();

		try {
			let response = await request
				.post(api.login(this.hostUrl))
				.send({ userName, pass });

			let { token, scope, expire } = response.body;
			this.hideLoading();
			return { token, scope, expire };
		} catch (ex) {
			this.hideLoading();
			console.log(ex);
			return null;
		}
	}

	@action
	logout() {
		return true;
	}

	@action
	async restQueryData(model, queryObj = {}) {
		if (!this._auth.loggedIn()) return null;

		try {
			let normalizeObj = {};
			Object.keys(queryObj).forEach(
				(key) => (normalizeObj[key] = JSON.stringify(queryObj[key]))
			);
			let response = await request
				.get(api.restAPI(this.hostUrl, model))
				.set('Authorization', this._auth.token)
				.query(normalizeObj);

			return response;
		} catch (err) {
			console.log(err);
			this._auth.checkTokenExpire(err.response);
			return null;
		}
	}

	@action
	async restUpdateData(model, modelData = {}) {
		if (!this._auth.loggedIn()) return null;

		try {
			const { _id, ...others } = modelData;
			let response = await request
				.patch(api.restAPI(this.hostUrl, model) + `/${_id}`)
				.set('Authorization', this._auth.token)
				.send(others);

			return response;
		} catch (err) {
			console.log(err);
			this._auth.checkTokenExpire(err.response);
			return null;
		}
	}

	@action
	async restCreateData(model, modelData = {}) {
		if (!this._auth.loggedIn()) return null;

		try {
			const { _id, ...others } = modelData;
			let response = await request
				.post(api.restAPI(this.hostUrl, model))
				.set('Authorization', this._auth.token)
				.send(others);

			return response;
		} catch (err) {
			console.log(err);
			this._auth.checkTokenExpire(err.response);
			return null;
		}
	}

	@action
	async startReview(id, message) {
		if (!this._auth.loggedIn()) return null;

		try {
			let response = await request
				.post(api.startReview(this.hostUrl))
				.set('Authorization', this._auth.token)
				.send({ id, message });

			return response;
		} catch (err) {
			console.log(err);
			this._auth.checkTokenExpire(err.response);
			return null;
		}
	}

	@action
	async approveCertificate(id, message, data) {
		this.isLoading = true;
		if (!this._auth.loggedIn()) return null;
		try {
			let response = await request
				.post(api.approveCer(this.hostUrl))
				.set('Authorization', this._auth.token)
				.send({
					id,
					message,
					decisions: data
				});

			if (response) {
				this.isLoading = false;
				return response;
			}
		} catch (err) {
			this.isLoading = false;
			console.log(err);
			this._auth.checkTokenExpire(err.response);
			return null;
		}
	}

	@action
	async sendFeedback(id, message, data) {
		this.isLoading = true;
		if (!this._auth.loggedIn()) return null;

		try {
			let response = await request
				.post(api.sendFeedback(this.hostUrl))
				.set('Authorization', this._auth.token)
				.send({
					id,
					message,
					decisions: data
				});

			if (response) {
				this.isLoading = false;
				return response;
			}
		} catch (err) {
			this.isLoading = false;
			console.log(err);
			this._auth.checkTokenExpire(err.response);
			return null;
		}
	}

	@action
	async rejectCertificate(id, message) {
		if (!this._auth.loggedIn()) return null;

		try {
			let response = await request
				.post(api.rejectCer(this.hostUrl))
				.set('Authorization', this._auth.token)
				.send({ id, message });

			return response;
		} catch (err) {
			console.log(err);
			this._auth.checkTokenExpire(err.response);
			return null;
		}
	}

	@action
	async getProfileSetting(id) {
		if (!this._auth.loggedIn()) return null;

		try {
			let response = await request
				.get(api.profileSetting(this.hostUrl))
				.set('Authorization', this._auth.token);

			return response;
		} catch (err) {
			console.log(err);
			this._auth.checkTokenExpire(err.response);
			return null;
		}
	}

	@action
	async getUsername(id) {
		if (!this._auth.loggedIn()) return null;

		try {
			let response = await request
				.get(api.getUsername(this.hostUrl, id))
				.set('Authorization', this._auth.token);

			return response;
		} catch (err) {
			console.log(err);
			this._auth.checkTokenExpire(err.response);
			return null;
		}
	}

	@action
	async updatePassword(pass) {
		if (!this._auth.loggedIn()) return null;

		try {
			let response = await request
				.post(api.updatePassword(this.hostUrl))
				.set('Authorization', this._auth.token)
				.send({ pass });

			return response;
		} catch (err) {
			console.log(err);
			this._auth.checkTokenExpire(err.response);
			return null;
		}
	}

	@action
	async updateSetting(data) {
		if (!this._auth.loggedIn()) return null;

		try {
			let response = await request
				.put(api.updateSetting(this.hostUrl, data.id))
				.set('Authorization', this._auth.token)
				.send(data);

			if (response && response.body)
				this.appSetting = [
					...this.appSetting.filter(
						(setting) => setting.label !== response.body.label
					),
					response.body
				];

			this._auth.checkTokenExpire(response);
			return response;
		} catch (ex) {
			console.log(ex);
			return null;
		}
	}

	@action
	async querySetting() {
		try {
			this.showLoading();

			let response = await request.get(api.appSetting(this.hostUrl));

			if (response && response.body) this.appSetting = response.body;

			this.hideLoading();
			return response;
		} catch (ex) {
			console.log(ex);
			return null;
		}
	}

	@action
	async firstTimeSetup(payload) {
		try {
			let response = await request
				.post(api.appFirstTimeSetup(this.hostUrl))
				.send(payload);

			this.querySetting();

			return response;
		} catch (ex) {
			console.log(ex);
			return null;
		}
	}

	@action
	showLoading() {
		this.isLoading = true;
	}

	@action
	hideLoading() {
		this.isLoading = false;
	}

	@action
	setHost(url) {
		this.hostUrl = url;
	}

	@action
	async updateMarkField(id, slug, comment, status) {
		try {
			let response = await request
				.post(api.updateMarkField(this.hostUrl))
				.set('Authorization', this._auth.token)
				.send({ id, slug, comment, status });
			if (response.body) {
				return response.body[0]._id;
			}
		} catch (ex) {
			this.hideLoading();
			console.log(ex);
			return null;
		}
	}
}
