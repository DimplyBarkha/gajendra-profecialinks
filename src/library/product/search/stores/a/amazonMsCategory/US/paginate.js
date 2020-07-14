
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'amazonMsCategory',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ol>li span[class*="item"]>a:nth-child(1)',
    noResultsXPath: '//img[contains(@alt,"Dogs of Amazon")]',
    openSearchDefinition: {
      template: 'https://www.amazon.com/gp/bestsellers/*/{searchTerms}?_encoding=UTF8&pg={page}',
    },
    domain: 'amazon.com',
  },
};
