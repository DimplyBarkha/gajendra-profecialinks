
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'DE',
    store: 'mediamarkt',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    // openSearchDefinition: {
    //   template: 'https://www.mediamarkt.de/de/search.html?page={page}&query={searchTerms}',
    // },
    domain: 'mediamarkt.de',
    zipcode: '',
  },
};
