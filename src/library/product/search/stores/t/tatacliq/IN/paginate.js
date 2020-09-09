module.exports = {
    implements: 'product/search/paginate',
    parameterValues: {
        country: 'IN',
        store: 'tatacliq',
        nextLinkSelector: '#grid-wrapper_desktop~div>div',
        mutationSelector: '#grid-wrapper_desktop',
        spinnerSelector: null,
        loadedSelector: 'img~div',
        noResultsXPath: null,
        openSearchDefinition: null,
        domain: 'tatacliq.com',
        zipcode: '',
    },
};