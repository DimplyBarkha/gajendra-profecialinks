
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'wine',
    domain: 'wine.com',
    loadedSelector: 'div.pipProdInfo',
    noResultsXPath: "//p[contains(text(),'We couldn't find that page')]",
    zipcode: '',
  },
};
