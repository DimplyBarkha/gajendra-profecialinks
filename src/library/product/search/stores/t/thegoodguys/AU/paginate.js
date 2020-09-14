module.exports = {
    implements: 'product/search/paginate',
    parameterValues: {
        country: 'AU',
        store: 'thegoodguys',
        nextLinkSelector: '.paging_controls > button',
        mutationSelector: null,
        spinnerSelector: null,
        loadedSelector: '#product_listing_tab>ul>li:last-child',
        noResultsXPath: '//*[contains(@class,"results_description")]',
        openSearchDefinition: null,
        domain: 'thegoodguys.com.au',
        zipcode: '',
    },
};