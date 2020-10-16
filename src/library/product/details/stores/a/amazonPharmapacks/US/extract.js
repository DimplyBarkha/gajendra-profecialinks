const { transform } = require('../../../../sharedAmazon/transformNew');
const { implementation } = require('../shared')
module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'US',
        transform,
        store: 'amazonPharmapacks',
        domain: 'amazon.com',
    },
    implementation,
};