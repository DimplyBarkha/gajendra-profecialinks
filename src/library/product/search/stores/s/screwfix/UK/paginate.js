
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'screwfix',
    nextLinkXpath: '//div[contains(@class,"row hide-sm")]//div[@class="pagi"]//span[@class="pagi__page-total"]//a[@id="next_page_link"]/@href',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#sticky-right-content',
    noResultsXPath: '//h3[contains(text(),"Hints to improve your search:")]',
    openSearchDefinition: null,
    domain: 'screwfix.com',
    zipcode: "''",
  },
};