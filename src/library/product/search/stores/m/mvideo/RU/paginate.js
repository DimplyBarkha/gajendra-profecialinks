
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'RU',
    store: 'mvideo',
    nextLinkSelector: '#pagnNextString, #pagnNextLink div div.pagination-container div div a.c-pagination__next.font-icon.icon-up',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'mvideo.ru',
    zipcode: '',
  },
};
