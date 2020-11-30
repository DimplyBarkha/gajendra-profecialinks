
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AT',
    store: 'basler-beauty',
    nextLinkSelector: '#itemsPager > li:last-child',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.list-container',
    noResultsXPath: '//*[contains(@class,"dd-shortcode-image")]//img/@src',
    openSearchDefinition: {
      template: 'https://www.basler-beauty.at/index.php?cl=search&searchparam={searchTerms}&pgNr={page}',
    },
    domain: 'basler-beauty.at',
    zipcode: '',
  },
};
