import ApplicationStore from './ApplicationStore'
import Auth from './Auth';

// safe guard for runtime config
window.env = window.env || {}

const auth = new Auth();

const stores = {
    ApplicationStore: new ApplicationStore(auth),
    Auth: auth,
}

export default stores;