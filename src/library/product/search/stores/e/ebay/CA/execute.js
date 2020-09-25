
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'ebay',
    domain: 'ebaystores.ca',
    url: 'http://www.ebaystores.ca/Dyson-Canada/_i.html?_nkw={searchTerms}&_ipg=200',
    loadedSelector: 'div.tpgv > div.wp',
    noResultsXPath: null,
    zipcode: '',
  },
};
