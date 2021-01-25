module.exports = {
    implements: 'product/details/execute',
    parameterValues: {
        country: 'NL',
        store: 'plus',
        domain: 'plus.nl',
        loadedSelector: '.ish-productList-item img',
        noResultsXPath: '//*[@class="ish-search-noResults-title"]',
        zipcode: '',
    },
};