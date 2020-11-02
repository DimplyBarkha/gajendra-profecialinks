module.exports = {
    implements: 'product/search/paginate',
    parameterValues: {
        country: 'PL',
        store: 'mediamarkt',
        nextLinkSelector: 'div[class="b-listing_toolBarPagination"] > nav > a[class*="pagination_next"] , a[class*="is-nextPage"]>i',
        mutationSelector: null,
        spinnerSelector: null,
        loadedSelector: null,
        noResultsXPath: null,
        openSearchDefinition: null,
        domain: 'mediamarkt.pl',
        zipcode: '',
    },
};