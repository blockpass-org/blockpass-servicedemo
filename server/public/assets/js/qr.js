(function () {
    'use strict';

    var jq = window.jQuery;

    jq.get(
        'http://blockpass.local/blockpass_demo/api/getQRCode',
        function(data) {
            var options = {
                render: 'canvas',
                minVersion: 1,
                maxVersion: 6,
                ecLevel: 'L',
                left: 0,
                top: 0,
                size: 350,
                fill: '#222222',
                background: '#EEEEEE',
                text: data.qrCode,
                radius: 0.5,
                quiet: 1,
                mode: 0,
                mSize: 0.1,
                mPosX: 0.5,
                mPosY: 0.5,
                label: 'no label',
                fontname: 'sans',
                fontcolor: '#000',
                image: null
            };

            jq('#qrcode').empty().qrcode(options);
        }
    )
}());
