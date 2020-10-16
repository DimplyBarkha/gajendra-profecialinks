const { transform } = require('../shared');
const { implementation } = require('../sharedExtract')
module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'US',
        store: 'amazonRuna',
        transform,
        domain: 'amazon.com',
    },
    implementation,
};