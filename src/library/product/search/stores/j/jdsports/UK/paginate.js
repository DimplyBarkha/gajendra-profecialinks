module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'UK',
    store: 'JDSports',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul[id=productListMain]',
    openSearchDefinition: {
      template: 'https://www.jdsports.co.uk/search/{searchTerms}&page={page}',
    },
    domain: 'jdsports.co.uk',
  },
};