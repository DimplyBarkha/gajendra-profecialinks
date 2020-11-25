
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'PL',
    store: 'empik',
    domain: 'empik.com',
    loadedSelector: 'div.productGallery   div.productGallery__mainImage.ta-gallery img',
    noResultsXPath: '//div[contains(@class,"siteInfo error-404")]//div[contains(@class,"infoBlack")]//p',
    zipcode: '',
  },
};
