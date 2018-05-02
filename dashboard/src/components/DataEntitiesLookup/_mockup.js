// rules: https://github.com/yiminghe/async-validator#type
// type: text | select | checkbox

const DATA = [
    {
        fieldName: '_id',
        displayName: 'Id',
        placeHolder: 'user id',
        rules: [{
            type: 'string',
            required: true
        }],
        onCustomRender: null,
        type: 'text',
        selectValues: null,
        layoutColSpan: 8,
    },
    {
        fieldName: 'type',
        displayName: 'Type',
        placeHolder: 'account type',
        rules: [],
        onCustomRender: null,
        type: 'select',
        selectValues: [
            'facebook',
            'google'
        ],
        initialValue: 'facebook',
        layoutColSpan: 4
    },
    {
        fieldName: 'isActive',
        displayName: 'IsActive',
        placeHolder: 'isActive',
        rules: [],
        initialValue: true,
        onCustomRender: null,
        type: 'checkbox',
        selectValues: null
    }
]

export default {
    entityFields: DATA
};