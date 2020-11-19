
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BR',
    store: 'cobasi',
    nextLinkSelector: 'li[class="neemu-pagination-next"] a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: '//div[@class="nm-not-found-message"]//h3',
    openSearchDefinition: null,
    domain: 'cobasi.com',
    zipcode: '',
  },
};
