
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PL',
    store: 'komputronik',
    nextLinkSelector:'li#pgn-static' ,
    mutationSelector: 'div#is-top-20 sp-bottom-grey-md',
    spinnerSelector: null,
    loadedSelector: 'div#content',
    noResultsXPath: '//*[@id="content"]/div[2]/div[3]',
    openSearchDefinition: null,
    domain: 'komputronik.pl',
    zipcode: "''",
  },
};
