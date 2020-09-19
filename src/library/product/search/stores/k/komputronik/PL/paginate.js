
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PL',
    store: 'komputronik',
    nextLinkSelector:'div.pagination > ul > li.pgn-static:last-child > a' ,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#content',
    noResultsXPath: '//div[contains(text(),"Nie znaleziono produktów spełniających podane kryteria.")]',
    openSearchDefinition: null,
    domain: 'komputronik.pl',
    zipcode: "''",
  },
};
