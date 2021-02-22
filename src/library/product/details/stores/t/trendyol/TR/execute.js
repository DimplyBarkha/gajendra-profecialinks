
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'TR',
    store: 'trendyol',
    domain: 'trendyol.com',
    loadedSelector: 'div.slick-slide.slick-active.slick-current img',
    noResultsXPath: "//div[@class='no-rslt-text']/span",
    zipcode: '',
  },
};
