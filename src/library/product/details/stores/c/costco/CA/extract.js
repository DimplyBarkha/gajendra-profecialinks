const { transform } = require('../sharedTransform');
const { implementation } = require('../extractImplementation');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'costco',
    transform,
    domain: 'costco.ca',
    zipcode: 'M5V 2A5',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {
      const descEl = document.querySelector('.product-info-description');

      if (descEl) {
        const enhancedContentEl1 = document.querySelector('#wc-power-page');
        const enhancedContentEl2 = document.querySelector('#syndi_powerpage');
        let enhancedContent = false;

        if (enhancedContentEl1 || enhancedContentEl2) {
          enhancedContent = true;
        }

        document.body.setAttribute('import-enhanced-content', enhancedContent.toString());
        enhancedContentEl1 ? enhancedContentEl1.remove() : null;
        enhancedContentEl2 ? enhancedContentEl2.remove() : null;
      }

      const scriptEl = document.evaluate("//script[contains(., 'pricePerUnit')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

      if (scriptEl) {
        let scriptText = scriptEl.innerText;
        let products = JSON.parse(scriptText.split('var products =')[1].split("var options = ")[0].split('\n').join('').trim().slice(0, -1));

        if (products[0].length > 1) {
          for (const product of products[0]) {
            let variantSku = product.partNumber;
            const variantEl = document.createElement('import-variant-sku');
            variantEl.setAttribute('data', variantSku);
            document.body.appendChild(variantEl);
          }
        }
      }
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
