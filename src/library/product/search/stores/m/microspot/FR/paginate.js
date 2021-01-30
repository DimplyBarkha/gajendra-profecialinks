
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'microspot',
    nextLinkSelector: 'div.INCD3A ul li:last-child a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: '//*[contains(text(),"Votre recherche de Machine")]',
    domain: 'microspot.ch/fr',
    zipcode: '',
  },
};
