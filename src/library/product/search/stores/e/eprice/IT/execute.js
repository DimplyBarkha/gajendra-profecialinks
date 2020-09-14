
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IT',
    store: 'eprice',
    domain: 'eprice.it',
    url: 'https://www.eprice.it/sa/?qs={searchTerms}',
    loadedSelector: 'section.ep_box_prodListing img',
    noResultsXPath: "//div[contains(text(), 'Nessun risultato trovato per')]",
    zipcode: '',
  },
};
