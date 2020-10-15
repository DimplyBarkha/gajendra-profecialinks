const { transform } = require('./shared');
const { implementation } = require('./sharedExtract')
module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'DE',
        store: 'amazonApparel',
        transform,
        domain: 'amazon.de',
    },
    implementation,
};