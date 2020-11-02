
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'BR',
    store: 'sephora',
    domain: 'sephora.com.br',
    loadedSelector: "div[id='thumbnails'] div[class *='item'] a[class *='details']",
    noResultsXPath: "//div[@class='std']//div[@style='width: 1220px; margin: 0 auto; text-align: center; padding: 40px;']/img",
    zipcode: '',
  },
};
