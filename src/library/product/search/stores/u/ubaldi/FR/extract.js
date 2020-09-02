const { transform } = require('../shared');
module.exports = {
    implements: 'product/search/extract',
    parameterValues: {
        country: 'FR',
        store: 'ubaldi',
        transform,
        domain: 'ubaldi.com',
        zipcode: '',
    },
};