const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(() => {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    const productUrls = document.querySelectorAll('div.ais-infinite-hits--item p.ais-hit--title a');
    productUrls.forEach(urlNode => {
      const link = urlNode.getAttribute('href');
      if (link.toLowerCase().includes('juul') || link.toLowerCase().includes('logic')) {
        addHiddenDiv('my-urls', link);
      }
    });
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'vapordna',
    transform,
    domain: 'vapordna.com',
    zipcode: "''",
  },
  implementation,
};
