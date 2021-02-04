
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BE',
    store: 'delhaize_fr',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.ProductSearchResultsPage',
    noResultsXPath: '//div[@class="ResultAmount-container"]/span[@class="ResultAmount" and starts-with(text(),"0 résultats pour")]',
    openSearchDefinition: null,
    domain: 'delhaize.be',
    zipcode: '',
  },
};
