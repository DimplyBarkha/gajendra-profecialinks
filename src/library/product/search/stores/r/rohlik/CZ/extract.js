const { transform } = require('../../../../shared');
module.exports = {
    implements: 'product/search/extract',
    parameterValues: {
        country: 'CZ',
        store: 'rohlik',
        transform,
        domain: 'rohlik.cz',
        zipcode: '',
    },
};