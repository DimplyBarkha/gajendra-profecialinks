
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'GR',
    store: 'sephora',
    nextLinkSelector: 'li#pagination_next_bottom',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#columns',
    noResultsXPath: '//div[@id="columns"]/div[@class="row"]/div[contains(@class,"no-results")]',
    openSearchDefinition: null,
    domain: 'sephora.gr',
    zipcode: '',
  },
};
