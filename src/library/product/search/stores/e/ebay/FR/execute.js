
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'ebay',
    domain: 'ebaystores.fr',
    url: 'https://www.ebay.fr/sch/i.html?_nkw={searchTerms}',
    loadedSelector: 'div#srp-river-results',
    noResultsXPath: "//span[contains(@class,'countClass') and contains(concat(' ',text(),' '),' 0 ')]",
    zipcode: '',
  },
};
