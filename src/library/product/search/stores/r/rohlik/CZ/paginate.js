module.exports = {
    implements: 'product/search/paginate',
    parameterValues: {
        country: 'CZ',
        store: 'rohlik',
        nextLinkSelector: null,
        mutationSelector: null,
        spinnerSelector: null,
        loadedSelector: "img[class*='productCard__img']",
        noResultsXPath: '//div[@data-test="no-products-found"]/p',
        resultsDivSelector: null,
        openSearchDefinition: null,
        domain: 'rohlik.cz',
        zipcode: '',
    },
};