module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'bijenkorf',
    domain: 'bijenkorf.nl',
    url: 'https://www.debijenkorf.nl/product-lister-page.html?SearchTerm={searchTerms}',
    loadedSelector: 'li[data-at="lister-product-item"]:nth-last-child(1)',
    noResultsXPath: '//div[contains(@class,"dbk-search-empty")]',
    zipcode: '',
  },
};
