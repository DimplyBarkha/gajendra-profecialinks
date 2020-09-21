
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UAE',
    store: 'acehardware',
    domain: 'aceuae.com',
    loadedXPath: '//div[contains(@class,"b-product-images__main")]//picture/img[@itemprop="image"]/@data-src',
    noResultsXPath: '//span[@class="h-rtlfix"][contains(text(),"We can’t seem to find the page you’re looking for")]',
    zipcode: '',
  },
};
