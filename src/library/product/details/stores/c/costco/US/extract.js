const { transform } = require('../sharedTransform');
const { implementation } = require('../extractImplementation');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'costco',
    transform,
    domain: 'costco.com',
    zipcode: '94209',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {
      const productNotFoundEl = document.querySelector('h1');

      if (productNotFoundEl.innerText.includes('Product Not Found!')) {
        throw new Error('Product not found');
      }

      const descEl = document.querySelector('#product_tabs .product-info-description');

      if (descEl) {
        const featureBullets = descEl.querySelectorAll('li');

        for (const el of featureBullets) {
          const newEl = document.createElement('import-feature');
          newEl.innerText = el.innerText;
          document.body.appendChild(newEl);
          el.remove();
        }

        const newDescEl = document.createElement('import-description');
        newDescEl.innerText = descEl.innerText;
        document.body.appendChild(newDescEl);
      }
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },

//   implementation: async (inputs,
//     parameters,
//     context,
//    dependencies,
//     ) => {
// await context.evaluate(async function () {


//  let sku = products[0].map(e => { return e.partNumber}).join(" | ")
//  document.body.setAttribute('variantId',sku);
//  }

// });
// const { productDetails } = dependencies;
// await context.extract(productDetails);
// },

};
