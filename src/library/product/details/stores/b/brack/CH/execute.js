
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CH',
    store: 'brack',
    domain: 'brack.ch',
    // loadedSelector: 'div.productStage__infoText, ul.productList > li.product-card',
    // noResultsXPath: '//div[contains(@class, "hasNoSearchResults")] | //div[@class="wrapper error-404"]',
    loadedSelector: 'div.productStage__infoText, ul.productList > li.product-card, div[class*="hasNoSearchResults"], div.productNotFound',
    noResultsXPath: '//div[@id="searchInfo"]//p[contains(.,"Leider konnten wir zu Ihrer Suchanfrag")]',
    zipcode: '',
  },
};
