const { cleanUp } = require('../../../../shared');

module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'AE',
        store: 'bloomingdales',
        transform: cleanUp,
        domain: 'bloomingdales.ae',
        zipcode: '',
    },
};