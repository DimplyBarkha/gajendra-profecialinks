module.exports = {
    implements: 'product/search/paginate',
    parameterValues: {
        country: 'ES',
        store: 'mediamarkt',
        nextLinkSelector: 'div[id="category"]>[class="pagination-wrapper cf"]:nth-of-type(2) >ul >li > a[rel="next"]',
        mutationSelector: null,
        spinnerSelector: null,
        loadedSelector: 'figure[class="photo-wrapper"]',
        noResultsXPath: '//div[@class="column-left"]',
        openSearchDefinition: null,
        domain: 'mediamarkt.es',
        zipcode: '',
    },
};