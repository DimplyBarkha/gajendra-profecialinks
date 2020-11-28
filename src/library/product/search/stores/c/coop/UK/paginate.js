
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'coop',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'article.coop-l-flex__item',
    noResultsXPath: '//div[@class="ais-index" and not(.//div[contains(@class,"ais-results")])]',
    openSearchDefinition: {
      template: 'https://www.coop.co.uk/products/search?query=Shiraz&page={page}',
      pageOffset: 0,
      pageStartNb: 1,
    },
    domain: 'coop.co.uk',
    zipcode: "''",
  },
};
