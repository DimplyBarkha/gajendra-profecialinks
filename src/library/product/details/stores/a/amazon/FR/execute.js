module.exports = {
    implements: 'product/details/execute',
    parameterValues: {
        country: 'FR',
        store: 'amazon',
        domain: 'amazon.fr',
        zipcode: '75019',
        loadedSelector: 'div[id="centerCol"]',
        noResultsXPath: null,
    },
};