module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    domain: 'cvs.com',
    store: 'cvs',
    nextLinkSelector: 'div.css-1dbjc4n.r-1awozwy.r-14lw9ot.r-rs99b7',
    // mutationSelector: 'div.css-1dbjc4n.r-13awgt0.r-1wtj0ep',
    spinnerSelector: 'div[role="progressbar"]',
  },
};
