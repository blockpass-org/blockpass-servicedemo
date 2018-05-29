import { action, autorun, observable } from 'mobx';

const constants = {
	AUTH_KEY_NAME: 'Auth'
};

class Auth {
	@observable scope = [];
	@observable token = '';
	@observable expire = 0;

	constructor() {
		this.loadState();
		autorun(() => this.saveState());
	}

	@action
	setToken = (_token, _expire) => {
		// console.log('Auth::setToken', _token, _expire);
		this.token = _token || '';
		this.expire = _expire || 0;
	};

	@action
	setPermission = (_permissions) => {
		try {
			if (Array.isArray(_permissions)) this.scope = _permissions;
		} catch (err) {
			this.scope = [];
		}
	};

	@action
	checkTokenExpire = (response) => {
		// console.log('Auth::checkTokenExpire', response);
		if (response.status === 403) {
			this.token = '';
			this.expire = 0;
			this.scope = [];
			// throw new Error(response.statusText);
		}
		return response;
	};

	loggedIn() {
		// HNToan cheat
		// return true;
		let cur = new Date();
		// console.log('Auth::loggedIn', this.account, this.token, this.expire)
		return this.token !== '' && this.expire > cur.getTime();
	}

	hasOneOfPermission(_permissionList) {
		return _permissionList.some(
			(value) => this.scope.indexOf(value) !== -1
		);
	}

	hasPermission(_permission) {
		// HNToan cheat
		if (_permission == null) return true;

		if (!Array.isArray(_permission)) _permission = [ _permission ];
		return this.hasOneOfPermission(_permission);
	}

	saveState = () => {
		// console.log('Auth::hydrate')
		window.localStorage.setItem(
			constants.AUTH_KEY_NAME,
			JSON.stringify({
				token: this.token,
				expire: this.expire,
				scope: this.scope
			})
		);
	};

	@action
	loadState() {
		let storeObj = {};
		try {
			storeObj = JSON.parse(window.localStorage[constants.AUTH_KEY_NAME]);
		} catch (err) {
			// console.log('Auth::dehydrate error ' + err)
			storeObj = undefined;
		}

		if (storeObj === undefined) {
			// console.log('Auth::dehydrate init default values');
			this.setToken('', 0);
			this.setPermission([]);
		} else {
			// console.log('Auth::dehydrate load values from store');
			this.setToken(storeObj.token, storeObj.expire);
			this.setPermission(storeObj.scope);
		}
	}

	@action
	clearState = () => {
		this.account = '';
		this.token = '';
		this.expire = 0;
		this.scope = [];
	};
}

export default Auth;
