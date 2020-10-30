module.exports = {
    implements: 'product/search/paginate',
    parameterValues: {
        country: 'PL',
        store: 'mediamarkt',
        nextLinkSelector: 'form[name="paginate-form"] > nav > a[class*="pagination_next"]',
        mutationSelector: null,
        spinnerSelector: null,
        loadedSelector: null,
        noResultsXPath: null,
        openSearchDefinition: null,
        domain: 'mediamarkt.pl',
        zipcode: '',
    },
};