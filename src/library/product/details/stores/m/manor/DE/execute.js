
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DE',
    store: 'manor',
    domain: 'manor.ch',
    loadedSelector: 'div.js-productdetail',
    noResultsXPath: "//div[contains(text(),'Die gesuchte Seite wurde leider nicht gefunden')]",
    zipcode: '',
  },
};
