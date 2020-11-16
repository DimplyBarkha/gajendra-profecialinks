const { transform } = require('./format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'danmurphys',
    transform,
    domain: 'danmurphys.com.au',
    zipcode: "''",
  },
};