const { transform } = require('../../../../shared');
module.exports = {
    implements: 'product/search/extract',
    parameterValues: {
        country: 'SE',
        store: 'kicks',
        transform: transform,
        domain: 'kicks.se',
        zipcode: '',
    },
}