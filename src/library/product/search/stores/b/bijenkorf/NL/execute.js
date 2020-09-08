
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'bijenkorf',
    domain: 'debijenkorf.nl',
    url: 'https://www.debijenkorf.nl/product-lister-page.html?SearchTerm={searchTerms}',
    loadedSelector: 'ul.productlist__list',
    noResultsXPath: '//div[contains(@class,"dbk-search-empty")]/h2',
    zipcode: '',
  },
};
