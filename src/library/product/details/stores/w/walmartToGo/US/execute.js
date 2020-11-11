module.exports = {
    implements: 'product/details/execute',
    parameterValues: {
        country: 'US',
        store: 'walmartToGo',
        domain: 'walmart.com',
        loadedSelector: 'h1[data-automation-id="name"]',
        noResultsXPath: null,
    },
};