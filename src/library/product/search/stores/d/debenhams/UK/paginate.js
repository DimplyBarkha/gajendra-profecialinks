module.exports = {
    implements: 'product/search/paginate',
    parameterValues: {
        country: 'UK',
        store: 'debenhams',
        nextLinkSelector: "nav.pw-pagination.dbh-pagination-bottom button.pw-pagination__next:not([disabled])",
        mutationSelector: null,
        spinnerSelector: null,
        loadedSelector: "div.t-product-list__container",
        noResultsXPath: "//div[contains(@class, 't-generic-error')]//h3[contains(@class, 't-generic-error-title')]",
        openSearchDefinition: {
            template: 'https://www.debenhams.com/search/{searchTerms}?pn={page}'
        },
        domain: 'debenhams.com',
        zipcode: '',
    },
};