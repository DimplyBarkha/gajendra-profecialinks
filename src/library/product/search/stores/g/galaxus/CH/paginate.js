
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CH',
    store: 'galaxus',
    nextLinkSelector: 'button.styled__StyledButton-sc-1b7q9no-1.gshMwM',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,//'picture.mediaPicture img',
    noResultsXPath: null,//"//h2[contains(@class, 'ZZ5g')] = 'Nothing found for'",
    openSearchDefinition: null,
    domain: 'galaxus.ch',
    zipcode: '',
  },
};
