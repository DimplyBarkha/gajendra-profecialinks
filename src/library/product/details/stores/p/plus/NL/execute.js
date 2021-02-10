module.exports = {
    implements: 'product/details/execute',
    parameterValues: {
        country: 'NL',
        store: 'plus',
        domain: 'plus.nl',
        loadedSelector: '.ish-productList-item img, .ish-product-photo img',
        noResultsXPath: '//*[@class="ish-search-noResults-block"]',
        zipcode: '',
    },
};