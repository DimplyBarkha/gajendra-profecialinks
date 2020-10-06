
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AT',
    store: 'expert',
    domain: 'expert.at',
    loadedSelector: 'div.content-block.product-detail-wrapper, div.product-item.is-clickable h2 > a',
    noResultsXPath: '//*[contains(text(), "Ups, bitte um Entschuldigung...")]',
    zipcode: '',
  },
};
