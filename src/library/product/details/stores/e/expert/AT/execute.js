
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AT',
    store: 'expert',
    domain: 'expert.at',
    loadedSelector: 'div.content-block.product-detail-wrapper',
    noResultsXPath: '//*[contains(text(), "Ups, bitte um Entschuldigung...")]',
    zipcode: '',
  },
};
