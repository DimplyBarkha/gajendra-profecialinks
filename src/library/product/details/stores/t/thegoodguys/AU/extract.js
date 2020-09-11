const { cleanUp } = require('../shared');
module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'AU',
        store: 'thegoodguys',
        transform: cleanUp,
        domain: 'thegoodguys.com.au',
        zipcode: '',
    },
};