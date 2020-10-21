module.exports = {
    implements: 'product/details/createUrl',
    parameterValues: {
        domain: 'amazon.ca',
        prefix: 'dp',
        country: 'CA',
        store: 'amazon',
        url: 'https://www.amazon.ca/dp/{id}?th=1&psc=1',
    },
};