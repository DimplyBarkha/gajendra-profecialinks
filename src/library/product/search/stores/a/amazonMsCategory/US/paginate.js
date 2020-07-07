const { util } = require("chai");

module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'amazonMsCategory',
    nextLinkSelector: 'ul.a-pagination>li.a-last:not(.a-disabled)',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ol>li span[class*="item"]>a:nth-child(1)',
    noResultsXPath: '//img[contains(@alt,"Dogs of Amazon")]',
    openSearchDefinition: null,
    domain: 'amazon.com',
  },
};
