
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IL',
    store: 'lastprice',
    domain: 'lastprice.co.il',
    url: 'https://www.lastprice.co.il/category.asp?q={searchTerms}',
    loadedSelector: 'div.price > div > div.sm > font > font',
    noResultsXPath: '//h4//span[contains(text(),"לא נמצאו מוצרים")]',
    zipcode: '',
  },
};
