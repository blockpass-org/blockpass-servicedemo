export default {
    restAPI: (host, model) => host + '/api/v1/' + model,
    login: host => host + '/auth/login',
    logout: host => host + '/auth/logout',
    profileSetting: host => host + '/auth/profile',
    updatePassword: host => host + '/auth/updatePass',
    startReview: host => host + '/blockpass/api/startReview',
    approveCer: host => host + '/blockpass/api/approveCertificate',
    rejectCer: host => host + '/blockpass/api/rejectCertificate',
    appSetting: host => host + '/setting',
    appFirstTimeSetup: host => host + '/setting/setup',
    kycStorageItem: (host, id) => host + '/api/v1/kyc/storage/' + id,
    updateSetting: (host,id) => `${host}/setting/:id`,
}