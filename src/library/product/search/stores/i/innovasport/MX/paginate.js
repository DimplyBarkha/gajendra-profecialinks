module.exports = {
    implements: 'product/search/paginate',
    parameterValues: {
        country: 'MX',
        store: 'innovasport',
        // nextLinkSelector: '.is-gridwall-pagination__list .is-gridwall-pagination__next a',
        nextLinkSelector: 'ul[class*="pagination__list"] > li[class*="pagination__next"]:not([class*="pageMoveDisabled"]) a',
        // nextLinkXPath: '//a[not(ancestor::li[contains(@class,"pageMoveDisabled")])]//span[@class="icon-chevron-right"]/..',
        mutationSelector: null,
        spinnerSelector: null,
        loadedSelector: '.price-int',
        noResultsXPath: '//div[@class="note-msg"]//span',
        openSearchDefinition: null,
        domain: 'innovasport.com',
        zipcode: '',
    },
};