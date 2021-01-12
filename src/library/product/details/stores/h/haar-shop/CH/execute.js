
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CH',
    store: 'haar-shop',
    domain: 'haar-shop.ch',
    // loadedSelector: 'main#maincontent',
    loadedSelector: 'body',
    noResultsXPath: '//p[contains(text(),"Dieses Problem kann mehrere Ursachen haben, die zum gleichen Fehler führen.")]',
    zipcode: "''",
  },
};
