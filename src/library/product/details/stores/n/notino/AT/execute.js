
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AT',
    store: 'notino',
    domain: 'notino.at',
    loadedSelector: "img[id='pd-image-main']",
    noResultsXPath: "//div[@id='categoryBanners0']",
    zipcode: '',
  },
};
