const { cleanUp } = require('./transform');

module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
        country: 'ES',
        store: 'bebitus',
        transform: cleanUp,
        domain: 'bebitus.com',
        zipcode: '',
    },
};