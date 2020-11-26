
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DE',
    store: 'mediamarkt',
    domain: 'mediamarkt.de',
    loadedSelector: 'div[class*=PriceContainer]',
    noResultsXPath: '//p[contains(text(),"Ups! Etwas ist schiefgelaufen!")] | //div[contains(@class, "ProductNotAvailable")]',
    zipcode: "''",
  },
};
