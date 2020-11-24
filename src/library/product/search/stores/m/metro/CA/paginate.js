module.exports = {
    implements: 'product/search/paginate',
    parameterValues: {
        country: 'CA',
        store: 'metro',
        nextLinkSelector: null,
        mutationSelector: null,
        spinnerSelector: null,
        loadedSelector: '.tile-product__top-section__visuals__stickers',
        noResultsXPath: '//div[@class="product-not-found"]',
        openSearchDefinition: {
            template: 'https://www.metro.ca/en/online-grocery/search-page-{page}?&filter={searchTerms}'
        },
        domain: 'metro.ca',
        zipcode: '',
    },
};