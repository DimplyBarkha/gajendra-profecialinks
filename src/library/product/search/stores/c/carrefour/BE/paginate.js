
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BE',
    store: 'carrefour',
    nextLinkSelector: null, //  'li.pagination-next a[rel="next"]',
    mutationSelector: null,
    // spinnerSelector: 'div.loader-container div',
    // loadedSelector: 'div.wrapper', //'ul.product__listing div.product-item',
    loadedSelector: 'ul.product__listing div.product-item',
    noResultsXPath: '//h2[contains(.,"0 résultats correspondants à")]',
    // noResultsXPath: '//div[@class="slp-container" and contains(.,"Aucun résultat ne correspond à votre recherche. Veuillez faire une nouvelle recherche")]',
    resultsDivSelector: null,
    // openSearchDefinition: null,
    openSearchDefinition: {
      pageStartNb:0,
      template: 'https://drive.carrefour.eu/fr/search?q={searchTerms}&page={page}',
    },
    domain: 'carrefour.eu',
    zipcode: "''",
  },
};
