
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DE',
    store: 'douglas',
    domain: 'douglas.de',
    loadedSelector: 'div.product-detail-component',
    noResultsXPath: '//main[@id="rd__not-found-page"] | //div[@class="rd__error-content__headline"] | //div[contains(@class, "div.rd__error-content__image")]',
  },
};
