
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AT',
    store: 'notino',
    domain: 'notino.at',
    url: 'https://www.notino.at/search.asp?exps={searchTerms}',
    loadedSelector: "ul[id='productsList'] li[class='item'] span[class='img'] img",
    noResultsXPath: "//div[@class='collapsable search-results']//p[contains(text(),'Dem gesuchten Begriff')]",
    zipcode: '',
  },
};
