
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'real',
    nextLinkSelector: null,
    loadedSelector: 'div#page',
    openSearchDefinition: {
      template: 'https://www.real.de/item/search/?search_value={searchTerms}&page={page}',
    },
    domain: 'real.de',
    zipcode: '',
  },
};
