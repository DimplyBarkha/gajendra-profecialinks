module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'thefragranceshop',
    domain: 'thefragranceshop.co.uk',
    url: 'https://www.thefragranceshop.co.uk/search?freeText={searchTerms}',
    loadedSelector: 'div.col-sm-12.col-xs-12.no-padding.gridView',
    noResultsXPath: '//div[@class="fnl-landing-noresults"]',
    zipcode: '',
  },
};
