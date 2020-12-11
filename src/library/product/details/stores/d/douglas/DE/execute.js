
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DE',
    store: 'douglas',
    domain: 'douglas.de',
    loadedSelector: 'div.rd__product-header',
    noResultsXPath: '//main[@class="rd__not-found-page"] | //div[@class="rd__error-content"]',
  },
};
