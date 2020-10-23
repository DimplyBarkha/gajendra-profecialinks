const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'easycaresolutions',
    transform,
    domain: 'easycaresolutions.co.uk',
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
        const liSelector = Array.from(document.querySelectorAll('div[itemprop*=description] li'));
        if (liSelector.length > 0) {
          addHiddenDiv('descriptionBulletCount', liSelector.length);
        }

        const packSize = document.querySelector('div[itemprop*=sku]');
        if (packSize.innerHTML && packSize.innerHTML.includes('Pack')) {
          const pack = packSize.innerHTML.split(' ')[2];
          addHiddenDiv('packSize', pack);
        }
      });

      await context.evaluate(async () => {
        await new Promise(resolve => setTimeout(resolve, 5000));
        await context.waitForSelector('div[class*=page-wrapper]');
      });
    } catch (e) {
      console.log(e);
    };
    await new Promise(resolve => setTimeout(resolve, 10000));
    return await context.extract(productDetails, { transform });
  },
};
