module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IT',
    store: 'eprice',
    domain: 'eprice.it',
    loadedSelector: null,
    noResultsXPath: "//div[contains(@class, 'sezNegozi')] | //div[@id='txt']//*[contains(text(),'Saremo online a breve')]",
    zipcode: '',
  },
};
