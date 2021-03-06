import KYCListPage from './KYC/KYCListPage';
import UserAdminPage from './UserAdminPermission/UserAdminPage';
import UserAdminDetailPage from './UserAdminPermission/UserAdminDetailPage';
import KYCDetailPage from './KYC/KYCDetailPage';
import AccountSettingPage from './AccountSetting/AccountSettingPage';
import RootSettingPage from './RootSetting';
import QuickTest from './QuickTest/QuickTest';
import CertificateReview from './CertificateReview';
import { KYCDetail, KYCList } from './NewKYC';

export const PageConfigs = [
	{
		path: '/',
		/** go to KYC LIST after login */
		// component: AccountSettingPage
		scope: [ 'admin', 'reviewer' ],
		component: KYCListPage
	},
	{
		path: '/new/kyc-detail/:id',
		component: KYCDetail
	},
	{
		path: '/new/kyc-list',
		component: KYCList
	},
	{
		path: '/permissions',
		scope: 'admin',
		component: UserAdminPage
	},
	{
		path: '/permission/:id',
		scope: 'admin',
		component: UserAdminDetailPage
	},
	{
		path: '/kyc',
		scope: [ 'admin', 'reviewer' ],
		component: KYCListPage
	},
	{
		path: '/kyc/detail/:id',
		scope: [ 'admin', 'reviewer' ],
		component: KYCDetailPage
	},
	{
		path: '/setting',
		component: AccountSettingPage
	},
	{
		path: '/quicktest',
		component: QuickTest
	},
	{
		path: '/rootsetting',
		scope: 'admin',
		component: RootSettingPage
	},
	{
		path: '/review-certificate',
		scope: [ 'admin', 'reviewer' ],
		component: CertificateReview
	}
];

export const DrawerConfigs = [
	{
		key: 1,
		icon: 'lock',
		path: '/permissions',
		text: 'Access Controls',
		scope: 'admin'
	},
	{
		key: 2,
		icon: 'user',
		path: '/kyc',
		text: 'KYC',
		scope: [ 'admin', 'reviewer' ]
	},
	{
		key: 3,
		icon: 'profile',
		path: '/rootsetting',
		text: 'Root Setting',
		scope: 'admin'
	}
];
