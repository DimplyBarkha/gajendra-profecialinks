module.exports = {
    implements: 'product/search/paginate',
    parameterValues: {
        country: 'TR',
        store: 'mediamarkt',
        nextLinkSelector: '.pagination-next>a',
        mutationSelector: null,
        spinnerSelector: null,
        loadedSelector: 'figure[class="photo-wrapper"]',
        noResultsXPath: '//div[@class="column-left"] | //div[contains(@class,"banners b-hide m-hide")]//span[@class="photo"]/img',
        openSearchDefinition: null,
        domain: 'mediamarkt.com.tr',
        zipcode: '',
    },
};