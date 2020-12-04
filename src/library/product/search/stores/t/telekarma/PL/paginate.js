
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'PL',
    store: 'telekarma',
    // mutationSelector: '.d-none.d-sm-inline-block.findproducts b',
    nextLinkSelector: 'div.stronicowanie-1 a:nth-last-of-type(1)',
    loadedSelector: 'div#srodek',
    noResultsXPath: '//div[contains(@class,"contentPadding")][contains(.,"Nie znaleziono.")]',
    domain: 'telekarma.pl',
    zipcode: "''",
  },
};
