const { transform } = require('../shared');
module.exports = {
    implements: 'product/search/extract',
    parameterValues: {
        country: 'AU',
        store: 'thegoodguys',
        transform,
        domain: 'thegoodguys.com.au',
        zipcode: '',
    },
};