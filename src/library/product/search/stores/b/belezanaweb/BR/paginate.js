
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BR',
    store: 'belezanaweb',
    //nextLinkSelector: 'button.btn-load-more',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.showcase-gondola div.showcase-item',
    // noResultsXPath: '//h1[@class="content-page-title content-page-title-list" and contains(.,"não possui resultados")]',
    openSearchDefinition: null,
    domain: 'belezanaweb.com.br',
    zipcode: '',
  },
};
