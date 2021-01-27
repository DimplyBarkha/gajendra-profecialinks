module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'whisky',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    openSearchDefinition: {
      template: 'https://www.whisky.de/shop/index.php?cl=search&searchparam={searchTerms}&page={page}',
    },
    domain: 'whisky.de',
  },
};