const { transform } = require('./shared')
module.exports = {
    implements: 'product/search/extract',
    parameterValues: {
        country: 'TR',
        store: 'gittigidiyor',
        transform,
        domain: 'gittigidiyor.com',
        zipcode: '',
    },
};