
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'amazonMsCategory',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ol>li span[class*="item"]>a:nth-child(1)',
    noResultsXPath: '//img[contains(@alt,"Dogs of Amazon")] | /html[not(//ol/li)]',
    openSearchDefinition: {
      template: 'https://www.amazon.com/gp/bestsellers/{searchTerms}?pg={page}',
    },
    domain: 'amazon.com',
  },
};
