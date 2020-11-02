module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'TR',
    store: 'mediamarkt',
    domain: 'mediamarkt.com.tr',
    url: 'https://www.mediamarkt.com.tr/tr/search.html?query={searchTerms}&searchProfile=onlineshop&channel=mmtrtr',
    loadedSelector: 'figure[class="photo-wrapper"]',
    noResultsXPath: '//div[@class="column-left"] | //div[contains(@class,"banners b-hide m-hide")]//span[@class="photo"]/img',
    zipcode: '',
  },
};
