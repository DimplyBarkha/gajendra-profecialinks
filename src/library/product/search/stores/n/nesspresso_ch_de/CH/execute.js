
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'nesspresso_ch_de',
    domain: 'nespresso.com',
    url: 'https://www.nespresso.com/ch/de/sitemap',
    loadedSelector: 'li.sitemap__element a.sitemap__link',
    noResultsXPath: "//*[contains(text(), 'Leider konnten wir die gesuchte')]",
    zipcode: '',
  },
};
