
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'PL',
    store: 'telekarma',
    nextLinkSelector: 'div.jumpBox input[type=image]',
    loadedSelector: 'div#srodek',
    noResultsXPath: '//div[contains(@class,"contentPadding")][contains(.,"Nie znaleziono.")]',
    domain: 'telekarma.pl',
    zipcode: "''",
  },
};
