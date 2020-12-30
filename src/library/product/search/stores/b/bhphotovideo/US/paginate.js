
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'bhphotovideo',
    nextLinkSelector: 'a[data-selenium="listingPagingPageNext"] svg[class="bhIcon "]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[data-selenium="miniProductPage"]',
    noResultsXPath: '//div[@class="message_FdUqQ7Ey65cURVJ_vVe-f"] | //h1[@class="title_2Tkgx8jFMHLoxqcKbZDI7v"] | //section[@class="body-404"]',
    openSearchDefinition: null,
    domain: 'bhphotovideo.com',
    zipcode: '',
  },
};
