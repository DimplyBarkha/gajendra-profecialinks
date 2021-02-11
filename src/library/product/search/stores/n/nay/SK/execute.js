
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'SK',
    store: 'nay',
    domain: 'nay.sk',
    url: 'https://www.nay.sk/vysledky-vyhladavanie?do=searchBox-searchForm-submit&q={searchTerms}&lb.f%5B%5D=availability_rank_text%3AIN_STOCK&lb.f%5B%5D=availability_rank_text%3AEXHIBIT_ON_ESHOP&lb.f%5B%5D=availability_rank_text%3AAVAILABILITY_SOLD&lb.f%5B%5D=availability_rank_text%3ANOT_IN_STOCK',
    // url: 'https://www.nay.sk/vysledky-vyhladavanie?q={searchTerms}&do=searchBox-searchForm-submit',
    loadedSelector: null,
    // '#lb-results > div > div > ul',
    noResultsXPath: null,
    // '//p[@class="message message--error"]',
    zipcode: '',
  },
};
