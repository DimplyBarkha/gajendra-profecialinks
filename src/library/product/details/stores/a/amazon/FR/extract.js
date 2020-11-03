const { transform } = require('../../../../sharedAmazon/transformNew');
const { implementation } = require('./sharedExtract')

module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'FR',
        store: 'amazon',
        transform,
        domain: 'amazon.fr',
        zipcode: '75019',
    },
    implementation,
};