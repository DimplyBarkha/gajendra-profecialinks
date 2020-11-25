module.exports = {
    implements: 'product/search/execute',
    parameterValues: {
        country: 'TR',
        store: 'gittigidiyor',
        domain: 'gittigidiyor.com',
        url: `https://www.gittigidiyor.com/arama/?k={searchTerms}`,
        loadedSelector: 'ul.catalog-view.products-container>li',
        noResultsXPath: '//div[contains(@class, "no-result-icon")]',
        zipcode: '',
    },
};