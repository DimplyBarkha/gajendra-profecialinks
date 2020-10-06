module.exports = {
    implements: 'product/search/paginate',
    parameterValues: {
        country: 'ES',
        store: 'elcorteingles_papeleria',
        nextLinkSelector: '#pagination-next > a',
        mutationSelector: null,
        spinnerSelector: null,
        loadedSelector: 'li.products_list-item',
        noResultsXPath: '//div[@class="products_list-container _no_products vp"] | //html[not(//div[@id="products-list"]/ul/li)]',
        openSearchDefinition: null,
        domain: 'elcorteingles.es',
        zipcode: '',
    },
};