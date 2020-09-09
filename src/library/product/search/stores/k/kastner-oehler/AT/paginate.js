
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AT',
    store: 'kastner-oehler',
    nextLinkSelector: 'a.next.link',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.site_inner',
    noResultsXPath: '//div[@class="en_grid"]//h3[contains(text(),"Keine Treffer!")]',
    openSearchDefinition: null,
    domain: 'kastner-oehler.at',
    zipcode: '',
  },
};
