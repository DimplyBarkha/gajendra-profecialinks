
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'HU',
    store: 'rossmann',
    domain: 'rossmann.hu',
    loadedSelector: 'div.product-info',
    noResultsXPath: '//div[@class="std"]//img[contains(@alt,"404 - A keresett oldal nem található")]',
    zipcode: "''",
  },
};
