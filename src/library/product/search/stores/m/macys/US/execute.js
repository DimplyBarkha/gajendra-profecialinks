
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'macys',
    domain: 'macys.com',
    url: "https://www.macys.com/shop/featured/{searchTerms}",
    loadedSelector: 'body',
    noResultsXPath: "//div[@class='sortableGrid']//*[contains(text(),'0')]",
    zipcode: '',
  },
};
