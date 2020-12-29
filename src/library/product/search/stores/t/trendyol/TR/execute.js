module.exports = {
    implements: 'product/search/execute',
    parameterValues: {
        country: 'TR',
        store: 'trendyol',
        domain: 'trendyol.com',
        url: 'https://www.trendyol.com/sr?q={searchTerms}&os=1',
        loadedSelector: 'div.srch-prdcts-cntnr img',
        noResultsXPath: '//*[contains(.,"bulunamadı")]',
        zipcode: '',
    },
};