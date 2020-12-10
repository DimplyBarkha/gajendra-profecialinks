module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DE',
    store: 'breuninger',
    domain: 'breuninger.de',
    loadedSelector: 'div[class*="active"] img[class="bewerten-bild"][alt*="1"], h1.next-chapter',
    noResultsXPath: '//p[@class="shop-copytext bewerten-out-of-stock-banner__text"]',
    zipcode: '',
  },
};
