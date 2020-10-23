
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BG',
    store: 'ebag',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'article.item',
    noResultsXPath: '//div[contains(@class, "items-container")]//div[not(//div[@class="item-and-popup"])]',
    openSearchDefinition: {
      template: 'https://www.ebag.bg/search/?query={searchTerms}&page={page}',
    },
    domain: 'ebag.bg',
    zipcode: '',
  },
};
