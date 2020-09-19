
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PL',
    store: 'komputronik',
    nextLinkSelector:'div.pagination > ul > li.pgn-static:last-child > a' ,
    mutationSelector: null,
    spinnerSelector: 'div.fixed-loader',
    loadedSelector: 'ul.product-entry2-wrap',
    noResultsXPath: '//div[contains(text(),"Nie znaleziono produktów spełniających podane kryteria.")]',
    openSearchDefinition: null,
    domain: 'komputronik.pl',
    zipcode: "''",
  },
};
