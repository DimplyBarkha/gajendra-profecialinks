
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NL',
    store: 'salontopper',
    domain: 'salontopper.nl',
    loadedSelector: 'div[id="content"] > div[itemscope]',
    noResultsXPath: '//div[@id="content"]//h1[contains(text(), "Pagina niet gevonden")] | //p[contains(text(), "Op dit moment zijn er geen producten gevonden.")]',
    zipcode: '',
  },
};
