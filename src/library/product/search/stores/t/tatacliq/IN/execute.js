module.exports = {
    implements: 'product/search/execute',
    parameterValues: {
        country: 'IN',
        store: 'tatacliq',
        domain: 'tatacliq.com',
        url: 'https://www.tatacliq.com/search/?searchCategory=all&text={searchTerms}',
        loadedSelector: 'div#grid-wrapper_desktop>div>div>div>div>div:last-child',
        noResultsXPath: '/html[not(//div[contains(@id,"ProductModule")])]',
        zipcode: '',
    },
};