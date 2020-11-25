const { transform } = require('../shared');
module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'TR',
        store: 'gittigidiyor',
        transform,
        domain: 'gittigidiyor.com',
        zipcode: '',
    },
};