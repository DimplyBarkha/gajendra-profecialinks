module.exports = {
    implements: 'product/search/execute',
    parameterValues: {
        country: 'TR',
        store: 'trendyol',
        domain: 'trendyol.com',
        url: 'https://api.trendyol.com/websearchgw/api/infinite-scroll/tum--urunler?q={searchTerms}&pi=1',
        loadedSelector: 'body pre',
        noResultsXPath: null,
        zipcode: '',
    },
};