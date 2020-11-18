
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'ebay',
    domain: 'ebay.co.uk',
    url: 'http://www.ebaystores.co.uk/Dyson-Outlet/_i.html?_nkw={searchTerms}&',
    loadedSelector: 'div[class=tpgv]',
    noResultsXPath: '//div[contains(@class, "tprs") and not(descendant::div[contains(@class, "tpgv")])]',
    zipcode: '',
  },
};
