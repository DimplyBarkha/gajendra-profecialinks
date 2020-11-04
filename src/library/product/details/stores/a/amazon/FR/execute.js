module.exports = {
    implements: 'product/details/execute',
    parameterValues: {
        country: 'FR',
        store: 'amazon',
        domain: 'amazon.fr',
        loadedSelector: 'div[id="centerCol"]',
        noResultsXPath: null,
        //zipcode: '75019',
    },
};