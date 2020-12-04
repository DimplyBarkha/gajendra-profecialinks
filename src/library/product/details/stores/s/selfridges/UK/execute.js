
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'selfridges',
    domain: 'selfridges.com',
    loadedSelector: 'div.c-prod-card.--plp, section.c-product-hero',
    noResultsXPath: '//div[@class="box component section error-page-wrapper col-xs-12"]|//span//*[contains(text(), "re sorry")]|//body[contains(@class, "page-no-results")]',
    zipcode: '',
  },
};
