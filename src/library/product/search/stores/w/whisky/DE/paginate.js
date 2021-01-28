module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'whisky',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[id=searchList]',
    openSearchDefinition: {
      template: 'https://www.whisky.de/shop/index.php?cl=search&searchparam={searchTerms}&searchorigin=0&page={page}',
    },
    domain: 'whisky.de',
  },
};