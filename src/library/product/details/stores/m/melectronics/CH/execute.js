
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CH',
    store: 'melectronics',
    domain: 'melectronics.ch',
    loadedSelector: 'div.p-product-detail--item__options',
    noResultsXPath: "//div[@class='cms-error404--title']",
    zipcode: '',
  },
};
