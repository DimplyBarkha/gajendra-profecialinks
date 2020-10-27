const { transform } = require('../../../../shared');

module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'AE',
        store: 'bloomingdales',
        transform,
        domain: 'bloomingdales.ae',
        zipcode: '',
    },
};