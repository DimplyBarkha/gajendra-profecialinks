
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'DE',
    store: 'rossmann',
    openSearchDefinition: {
      template: 'https://www.rossmann.de/de/search?q={searchTerms}%3Arelevance&page={index}&pageSize=60#',
      pageIndexMultiplier: 1,
      pageStartNb: 0,
    },
    domain: 'rossmann.de',
    zipcode: '',
  },
};
