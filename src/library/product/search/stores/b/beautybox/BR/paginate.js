
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BR',
    store: 'beautybox',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.showcase-item[data-event]',
    noResultsXPath: '//div[contains(@class, "alert-message")]',
    openSearchDefinition: null,
    domain: 'beautybox.com.br',
    zipcode: '',
  },
};
