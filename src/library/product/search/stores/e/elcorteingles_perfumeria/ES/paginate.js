module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles_perfumeria',
    loadedSelector: 'img.js_preview_image.lazyloaded',
    nextLinkSelector: '#pagination-next > a',
    mutationSelector: null,
    spinnerSelector: null,
    noResultsXPath: '//p[contains(text(),"No se han encontrado ") or contains(text(),"no se han encontrado ")]',
    openSearchDefinition: null,
    domain: 'elcorteingles.es',
    zipcode: '',
  },
};
