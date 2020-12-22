module.exports = {
    implements: 'product/search/paginate',
    parameterValues: {
        country: 'CA',
        store: 'metro',
        nextLinkSelector: `div[class*='ppn--pagination'] > a:last-child:not(.disabled)`,
        mutationSelector: null,
        spinnerSelector: null,
        loadedSelector: '.tile-product__top-section__visuals__stickers',
        noResultsXPath: '//div[@class="product-not-found"]',
        openSearchDefinition: null,
        // openSearchDefinition: {
        //     template: 'https://www.metro.ca/en/online-grocery/search-page-{page}?&filter={searchTerms}',
        //     pageOffset: 1,
        // },
        domain: 'metro.ca',
        zipcode: '',
    },
};