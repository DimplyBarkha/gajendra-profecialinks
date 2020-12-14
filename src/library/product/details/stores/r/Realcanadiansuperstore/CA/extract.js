const { cleanUp } = require('../../../../shared');
module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'CA',
        store: 'Realcanadiansuperstore',
        transform: cleanUp,
        domain: 'realcanadiansuperstore.ca',
        zipcode: '',
    },
};