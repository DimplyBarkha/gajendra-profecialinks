
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'googleExpress',
    domain: 'google.fr',
    url: 'https://www.google.fr/search?tbm=shop&q={searchTerms}&tbs=buy:g',
    loadedSelector: "div[class*='product-results'] div[class*='sh-dlr__list-result'], div[class*='product-results-grid'] div[class*='grid-result']",
    noResultsXPath: "//p[contains(@role,'heading') and contains(.,'did not match')]",
    zipcode: '',
  },
};
