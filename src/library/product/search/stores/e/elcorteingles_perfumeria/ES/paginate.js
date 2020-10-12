module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles_perfumeria',
    nextLinkSelector: '#pagination-next > a',
    loadedSelector: '.products_list-item:nth-last-child(1)',
    mutationSelector: null,
    spinnerSelector: null,
    noResultsXPath: '//p[contains(text(),"No se han encontrado ") or contains(text(),"no se han encontrado ")] | //span[contains(text(),"No hemos encontrado nada buscando") ]',
    openSearchDefinition: null,
    domain: 'elcorteingles.es',
    zipcode: '',
  },
};
