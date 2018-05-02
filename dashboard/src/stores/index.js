import ApplicationStore from './ApplicationStore'
import Auth from './Auth';

const auth = new Auth();

const stores = {
    ApplicationStore: new ApplicationStore(auth),
    Auth: auth,
}

export default stores;