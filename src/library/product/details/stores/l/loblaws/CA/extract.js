const { cleanUp } = require('../../../../shared');
module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'CA',
        store: 'loblaws',
        transform: cleanUp,
        domain: 'loblaws.ca',
        zipcode: '',
    },
};