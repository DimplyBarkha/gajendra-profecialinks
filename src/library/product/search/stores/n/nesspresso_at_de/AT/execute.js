
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AT',
    store: 'nesspresso_at_de',
    domain: 'nespresso.com',
    url: 'https://www.nespresso.com/at/de/sitemap',
    loadedSelector: 'li.sitemap__element a.sitemap__link',
    noResultsXPath: "//*[contains(text(), 'Leider konnten wir die gesuchte')]",
    zipcode: '',
  },
};
