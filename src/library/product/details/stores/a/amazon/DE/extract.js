const { transform } = require('./transform');
const { implementation } = require('./sharedExtract')
module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'DE',
        store: 'amazon',
        transform,
        domain: 'amazon.de',
        zipcode: '10117',
    },
    implementation
};