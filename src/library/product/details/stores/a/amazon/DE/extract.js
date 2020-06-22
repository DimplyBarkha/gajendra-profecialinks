
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'amazon',
    transform: null,
    domain: 'amazon.de',
  },
  implementation: async ({ url }, { country, domain }, context, dependencies) => {
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
    await context.extract(dependencies.productDetails);
  },
};
