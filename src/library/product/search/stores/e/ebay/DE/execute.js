
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'ebay',
    domain: 'ebay.de',
    url: 'http://www.ebaystores.de/Dyson-Deutschland/_i.html?_nkw={searchTerms}',
    loadedSelector: 'div.tpgv',
    noResultsXPath: '//div[@class="trc"]/span[contains(text(), " 0 ")]',
    zipcode: '',
  },
};
