module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles_papeleria',
    domain: 'elcorteingles.es',
    url: 'https://www.elcorteingles.es/search/?v=Papeler%C3%ADa&s={searchTerms}&stype=text_box',
    loadedSelector: '.grid-item:nth-last-child(1)',
    noResultsXPath: null,
    zipcode: '',
  },
};
