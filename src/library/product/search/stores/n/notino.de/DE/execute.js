
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'notino',
    domain: 'notino.de',
<<<<<<< HEAD
    url: 'https://www.notino.de/search.asp?exps={searchTerms}',    
    loadedSelector: 'div[class="product-list product-list-facelift recommendations"]',
    noResultsXPath: '//div[@class="ca-box"]/p',
=======
    url: 'https://www.notino.de/search.asp?exps={searchTerms}',
    // url: 'https://www.notino.de/search.asp?exps=frizz',
    loadedSelector: 'body',
    noResultsXPath: null,
>>>>>>> 3c209d5e96462b24d30cc86f7e47a137ab410d21
    zipcode: '',
  },
};
