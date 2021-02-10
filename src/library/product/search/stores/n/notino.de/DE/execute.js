
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'notino',
    domain: 'notino.de',
    url: 'https://www.notino.de/search.asp?exps={searchTerms}',    
    loadedSelector: 'div[class="product-list product-list-facelift recommendations"]',
    noResultsXPath: '//div[@class="ca-box"]/p',
    zipcode: '',
  },
};
