module.exports = {
    implements: 'product/search/paginate',
    parameterValues: {
        country: 'MX',
        store: 'innovasport',
        nextLinkSelector: '.is-gridwall-pagination__next>a',
        mutationSelector: null,
        spinnerSelector: null,
        loadedSelector: '.is-pw__products-list',
        noResultsXPath: '//div[@class="note-msg"]//span',
        openSearchDefinition: null,
        domain: 'innovasport.com',
        zipcode: '',
    },
};