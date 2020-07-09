
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'amazonMsReviews',
    nextLinkSelector: 'ul.a-pagination>li.a-last a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[data-hook=review]',
    noResultsXPath: '//img[contains(@alt,"Dogs of Amazon")]',
    openSearchDefinition: null,
    domain: 'amazon.com',
  },
};
