
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'BR',
    store: 'beautybox',
    domain: 'beautybox.com.br',
    loadedSelector: "div[class='gallery-lightbox']",
    noResultsXPath: '//p[@class="alert-message-text"]',
    zipcode: '',
  },
};
