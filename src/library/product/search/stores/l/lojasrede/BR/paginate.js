
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BR',
    store: 'lojasrede',
    nextLinkSelector: '#pagnNextString, #pagnNextLink, li[class="neemu-pagination-next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'lojasrede.com.br',
    zipcode: '',
  },
};
