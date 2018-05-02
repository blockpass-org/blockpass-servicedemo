import BlankPage from './BlankPage'
import KYCListPage from './KYC/KYCListPage'
import UserAdminPage from './UserAdminPermission/UserAdminPage'
import UserAdminDetailPage from "./UserAdminPermission/UserAdminDetailPage";
import KYCDetailPage from './KYC/KYCDetailPage'
import AccountSettingPage from './AccountSetting/AccountSettingPage'
import RootSettingPage from './RootSetting'
import QuickTest from './QuickTest/QuickTest'

export const PageConfigs = [
    {
        path: '/',
        component: AccountSettingPage
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
        scope: ['admin', 'reviewer'],
        component: KYCListPage
    },
    {
        path: '/kyc/detail/:id',
        scope: ['admin', 'reviewer'],
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
        component: RootSettingPage,
    }
]

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
        scope: ['admin', 'reviewer']
    },
    {
        key: 3,
        icon: 'profile',
        path: '/rootsetting',
        text: 'Root Setting',
        scope: 'admin'
    }
]