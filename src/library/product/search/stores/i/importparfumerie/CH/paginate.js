
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CH',
    store: 'importparfumerie',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.list-page.spacing-top-10.spacing-bottom-10',
    noResultsXPath: '//div[contains(text(),"Geben Sie einen anderen Begriff ein und suchen Sie erneut.")]',
    openSearchDefinition: null,
    domain: 'importparfumerie.ch',
    zipcode: "''",
  },
};
