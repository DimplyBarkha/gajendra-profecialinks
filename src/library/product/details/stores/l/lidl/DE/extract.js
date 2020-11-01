// @ts-nocheck

const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'lidl',
    transform,
    domain: 'lidl.de',
    zipcode: '',
  },
  implementation: async ({ id }, { transform }, context, { productDetails: data }) => {
    await new Promise(resolve => setTimeout(resolve, 5000));
    await context.click('.cookie-alert-extended-button').catch(() => { });
    if (id) {
      await context.waitForSelector('.product-grid__item');
      await context.click('.product-grid__item');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    await context.evaluate(async function () {
      const addHiddenDiv = (id, content) => {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      };
      try {
        const productDetails = JSON.parse(document.evaluate('//script[@type = "application/ld+json"][1]', document, null, XPathResult.ANY_UNORDERED_NODE_TYPE).singleNodeValue.text);
        addHiddenDiv('import_product_price', window.dataLayer.filter(item => item.event === 'EECproductDetailView')[0].ecommerce.detail.products[0].price);
        addHiddenDiv('import_product_brand', window.dataLayer.filter(item => item.event === 'EECproductDetailView')[0].ecommerce.detail.products[0].brand);
        addHiddenDiv('import_product_ratingcount', productDetails.aggregateRating.ratingCount);
        addHiddenDiv('import_product_rating', productDetails.aggregateRating.ratingValue.toString().replace('.', ','));
      } catch (error) {
        console.log('Error: ', error);
      }
    });
    return await context.extract(data, { transform });
  },
};
