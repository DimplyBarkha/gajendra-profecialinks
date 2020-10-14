const { transform } = require('./transform');

module.exports = {
    implements: 'product/search/extract',
    parameterValues: {
        country: 'MX',
        store: 'innovasport',
        transform,
        domain: 'innovasport.com',
        zipcode: '',
    },
};