module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'bhphotovideo',
    domain: 'bhphotovideo.com',
    url: 'https://www.bhphotovideo.com/c/search?Ntt="{searchTerms}"&N=0&InitialSearch=yes&sts=ma',
    loadedSelector: 'div[data-selenium="miniProductPage"]',
    noResultsXPath: '//h1[@class="title_2Tkgx8jFMHLoxqcKbZDI7v"]',
    zipcode: '',
  },
};
