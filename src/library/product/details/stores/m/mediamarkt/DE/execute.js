
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DE',
    store: 'mediamarkt',
    domain: 'mediamarkt.de',
    loadedSelector: 'h1[itemprop="name"]',
    noResultsXPath: '//div[contains(@class, "ErrorPage")]|//p[contains(text(), "Ups! Etwas ist schiefgelaufen!")]',
    zipcode: '',
  },
};
