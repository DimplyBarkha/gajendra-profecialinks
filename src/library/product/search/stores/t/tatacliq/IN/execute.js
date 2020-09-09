module.exports = {
    implements: 'product/search/execute',
    parameterValues: {
        country: 'IN',
        store: 'tatacliq',
        domain: 'tatacliq.com',
        url: 'https://www.tatacliq.com/search/?searchCategory=all&text={searchTerms}',
        loadedSelector: 'img~div',
        noResultsXPath: null,
        zipcode: '',
    },
};