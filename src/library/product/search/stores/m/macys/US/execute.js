
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'macys',
    domain: 'macys.com',
    url: "https://www.macys.com/shop/featured/{searchTerms}/Pageindex,Productsperpage/1,60?",
    loadedSelector: 'body',
    noResultsXPath: "//div[@class='sortableGrid']//*[contains(text(),'0')]",
    zipcode: '',
  },
};
