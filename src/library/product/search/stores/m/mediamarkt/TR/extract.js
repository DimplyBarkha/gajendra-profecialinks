const { transform } = require('../transform');
const { implementation } = require('../extractImplementation');
module.exports = {
    implements: 'product/search/extract',
    parameterValues: {
        country: 'TR',
        store: 'mediamarkt',
        transform,
        domain: 'mediamarkt.com.tr',
        zipcode: '',
    },
    implementation,
};