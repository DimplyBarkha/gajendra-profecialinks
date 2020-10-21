const { transform } = require('./../../../../shared');
const { implementation } = require('./sharedExtract');
// @ts-ignore
module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'UK',
        store: 'amazon',
        transform,
        domain: 'amazon.co.uk',
        zipcode: 'SW1P 3EU',
    },
    implementation,
};