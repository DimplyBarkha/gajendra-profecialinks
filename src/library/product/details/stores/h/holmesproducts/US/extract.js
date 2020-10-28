const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'holmesproducts',
    transform,
    domain: 'holmesproducts.com',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    try {
      await context.evaluate(async () => {
        function addHiddenDiv (id, content) {
          const newDiv = document.createElement('div');
          newDiv.id = id;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
        }
        const liSelector = Array.from(document.querySelectorAll('div[class*="feature-bullets bumper"] li'));
        if (liSelector.length > 0) {
          addHiddenDiv('descriptionBulletCount', liSelector.length);
        }
        const imageTotal = Array.from(document.querySelectorAll('li[class*="thumb"]:not([class*="selected"]) a:not([class*="video"]) img[src]'));
        if (imageTotal.length > 0) {
          addHiddenDiv('imageTotal', imageTotal.length);
        }
      });
    } catch (e) {
      console.log(e);
    };
    await new Promise(resolve => setTimeout(resolve, 10000));
    return await context.extract(productDetails, { transform });
  },
};
