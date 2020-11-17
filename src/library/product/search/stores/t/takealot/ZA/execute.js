module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ZA',
    store: 'takealot',
    domain: 'takealot.com',
    url: "https://www.takealot.com/all?qsearch={searchTerms}",
    loadedSelector: "div.grid-container div.listings-container",
    noResultsXPath: "//div[contains(@class, 'grid-container')]//div[contains(@class, 'no-results')]//div[contains(@class, 'empty-list-message')]//h2",
    zipcode: '',
  },
};