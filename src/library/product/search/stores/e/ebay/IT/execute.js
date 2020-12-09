
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IT',
    store: 'ebay',
    domain: 'ebay.it',
    url: 'http://www.ebaystores.it/dyson-official/_i.html?_nkw={searchTerms}&',
    loadedSelector: 'div[class=tpgv]',
    noResultsXPath: '//div[contains(@class, "tprs") and not(descendant::div[contains(@class, "tpgv")])]',
    zipcode: '',
  },
};
