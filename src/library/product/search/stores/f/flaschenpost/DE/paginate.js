
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'flaschenpost',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: '//div[@class="fp-productList_content"]/span',
    openSearchDefinition: null,
    domain: 'flaschenpost.de',
    zipcode: '28203',
  },
};
