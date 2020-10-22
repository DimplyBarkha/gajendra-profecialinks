
module.exports = {
    implements: 'product/details/createUrl',
    parameterValues: {
        domain: 'amazon.com',
        prefix: 'dp',
        country: 'US',
        store: 'amazon',
        url: 'https://www.amazon.com/dp/{id}?th=1&psc=1',
    },
};