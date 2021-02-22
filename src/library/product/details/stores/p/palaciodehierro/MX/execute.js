
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'MX',
    store: 'palaciodehierro',
    domain: 'elpalaciodehierro.com',
    loadedSelector: "div[class*='product_images'] img",
    noResultsXPath: "//div[contains(@class,'l-error_page')]",
    zipcode: '',
  },
};
