const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'amazon',
    transform,
    domain: 'amazon.de',
    zipcode: '10117',
  },
  implementation: async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { transform } = parameters;
    await context.evaluate(() => {
      let prodDesc;
      if (document.querySelector('#feature-bullets ul')) {
        prodDesc = document.querySelector('#feature-bullets ul').innerText;
      }
      if (document.querySelector('#productDescription')) {
        if (document.querySelector('#productDescription p')) {
          prodDesc = prodDesc + ' | ' + document.querySelector('#productDescription p').innerText;
        }
        if (document.querySelector('#productDescription h3')) {
          if (document.querySelector('#productDescription h3').innerText.includes('Produktbeschreibung')) {
            prodDesc = prodDesc + ' | ' + document.querySelector('#productDescription h3').nextElementSibling.innerText;
          }
        }
      }
      document.body.setAttribute('prod_desc', prodDesc);
    });
    await context.extract(dependencies.productDetails, { transform });
  },
};
