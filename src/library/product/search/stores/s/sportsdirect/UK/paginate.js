module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    "country": "UK",
    "store": "sportsdirect",
    "nextLinkSelector": 'a.NextLink',
    "loadedSelector": null,
    "noResultsXPath": null,
    "domain": "sportsdirect.com",
    "zipcode": "",
  },
};