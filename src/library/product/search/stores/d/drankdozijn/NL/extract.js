const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NL',
    store: 'drankdozijn',
    transform,
    domain: 'drankdozijn.nl',
    zipcode: '',
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    await context.evaluate(() => {
      var newElement = document.createElement('DIV');
      newElement.setAttribute('class', 'search-url');
      newElement.innerHTML = 'https://drankdozijn.nl/zoeken?zoekterm=' + document.getElementById('zoekterm').getAttribute('value').replace(/\s/g, '+');
      document.body.appendChild(newElement);
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
