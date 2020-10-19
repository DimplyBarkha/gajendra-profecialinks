module.exports = {
    implements: 'product/search/paginate',
    parameterValues: {
        country: 'CA',
        store: 'metro',
        nextLinkSelector: 'a[aria-label="Next"]',
        mutationSelector: null,
        spinnerSelector: null,
        loadedSelector: '.tile-product__top-section__visuals__stickers',
        noResultsXPath: '//div[@class="product-not-found"]',
        openSearchDefinition: null,
        domain: 'metro.ca',
        zipcode: '',
    },
};