
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DE',
    store: 'mediamarkt',
    domain: 'mediamarkt.de',
    loadedSelector: 'div[class^="ProductDetail"]',
    noResultsXPath: '//div[contains(@class, "ErrorPage")]|//p[contains(text(), "Ups! Etwas ist schiefgelaufen!")]',
    zipcode: '',
  },
};
