
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BG',
    store: 'ebag',
    domain: 'ebag.bg',
    url: 'https://www.ebag.bg/search/?query={searchTerms}',
    loadedSelector: 'article.item',
    noResultsXPath: '//div[contains(@class, "items-container")]//div[not(//div[@class="item-and-popup"])]',
    zipcode: '',
  },
};
