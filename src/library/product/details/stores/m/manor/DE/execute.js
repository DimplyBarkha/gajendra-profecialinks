
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DE',
    store: 'manor',
    domain: 'manor.ch',
    loadedSelector: 'div.js-productdetail',
    noResultsXPath: "//div[contains(text(),'Malheureusement la page recherchée n'a pas été trouvée')]",
    zipcode: '',
  },
};
