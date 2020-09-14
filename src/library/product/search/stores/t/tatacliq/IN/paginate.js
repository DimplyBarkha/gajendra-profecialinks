module.exports = {
    implements: 'product/search/paginate',
    parameterValues: {
        country: 'IN',
        store: 'tatacliq',
        nextLinkSelector: '#grid-wrapper_desktop~div>div',
        mutationSelector: '#grid-wrapper_desktop>div',
        spinnerSelector: null,
        loadedSelector: 'div#grid-wrapper_desktop>div>div>div>div>div:last-child',
        noResultsXPath: '/html[not(//div[contains(@id,"ProductModule")])]',
        openSearchDefinition: null,
        domain: 'tatacliq.com',
        zipcode: '',
    },
};