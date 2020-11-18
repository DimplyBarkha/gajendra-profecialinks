
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'ebay',
    domain: 'ebaystores.fr',
    url: 'http://www.ebaystores.fr/dysonfrance/?submit=&_nkw={searchTerms}&_ipg=200',
    loadedSelector: 'div.p-box',
    noResultsXPath: "//span[contains(@class,'countClass') and contains(concat(' ',text(),' '),' 0 ')]",
    zipcode: '',
  },
};
