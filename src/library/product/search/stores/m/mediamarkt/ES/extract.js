const { transform } = require('../transform');
const { implementation } = require('../extractImplementation');
module.exports = {
    implements: 'product/search/extract',
    parameterValues: {
        country: 'ES',
        store: 'mediamarkt',
        transform,
        domain: 'mediamarkt.es',
        zipcode: '',
    },
    implementation,
};