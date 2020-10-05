
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'ebay',
    domain: 'ebaystores.com',
    url: 'http://www.ebaystores.com/dysonstore/_i.html?_nkw={searchTerms}&_ipg=200',
    loadedSelector: 'div.tpgv > div.wp',
    noResultsXPath: "//span[contains(@class,'cnt') and contains(concat(' ',text(),' '),' 0 ')]",
    zipcode: '',
  },
};
