module.exports = {
    implements: 'product/reviews/execute',
    parameterValues: {
        country: 'DE',
        store: 'saturn',
        domain: 'saturn.de',
        loadedSelector: 'section[id="reviews"]',
        noResultsXPath: null,
        reviewUrl: 'https://www.saturn.de/de/product/-{id}.html',
        sortButtonSelectors: null,
        zipcode: '',
    },
};