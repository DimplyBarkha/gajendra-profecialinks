
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BR',
    store: 'belezanaweb',
    // nextLinkSelector: "div[class='showcase-gondola'] button",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.showcase-gondola div.showcase-item',
    // noResultsXPath: '//h1[@class="content-page-title content-page-title-list" and contains(.,"não possui resultados")]',
    openSearchDefinition: null,
    domain: 'belezanaweb.com.br',
    zipcode: '',
  },
};
