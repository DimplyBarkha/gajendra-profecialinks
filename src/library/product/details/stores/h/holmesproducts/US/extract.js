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
        const liSelector = Array.from(document.querySelectorAll('div[class*="attributeList collapsible"] li'));
        if (liSelector.length > 0) {
          addHiddenDiv('descriptionBulletCount', liSelector.length);
        }
        const imageTotal = Array.from(document.querySelectorAll('.primary-images .slick-track div[class*="slick-slide"]:not([class*="slick-current"]) img[src]'));
        if (imageTotal.length > 0) {
          addHiddenDiv('imageTotal', imageTotal.length);
        }
        const packSize = document.querySelector('.pdp-tile h5[class*=product-name]');
        if (packSize.innerHTML && packSize.innerHTML.includes('-Inch')) {
          const pack = packSize.innerHTML.match(/([0-9]{1,})-Inch/);
          addHiddenDiv('size', pack[0]);
          console.log(pack[0]);
        } else if (packSize.innerHTML && packSize.innerHTML.includes('- Inch')) {
          const pack = packSize.innerHTML.match(/([0-9]{1,})- Inch/);
          addHiddenDiv('size', pack[0]);
          console.log(pack[0]);
        } else if (packSize.innerHTML && (packSize.innerHTML.includes('Inch') || packSize.innerHTML.includes('inch'))) {
          const pack = packSize.innerHTML.match(/([0-9]{1,}) Inch/i);
          addHiddenDiv('size', pack[0]);
          console.log(pack[0]);
        } else if (packSize.innerHTML && packSize.innerHTML.includes('-Pack')) {
          const pack = packSize.innerHTML.match(/([0-9]{1,})-Pack/);
          addHiddenDiv('size', pack[0]);
          console.log(pack[0]);
        } else if (packSize.innerHTML && packSize.innerHTML.includes('- Pack')) {
          const pack = packSize.innerHTML.match(/([0-9]{1,})- Pack/);
          addHiddenDiv('size', pack[0]);
          console.log(pack[0]);
        } else if (packSize.innerHTML && (packSize.innerHTML.includes('Pack') || packSize.innerHTML.includes('pack'))) {
          const pack = packSize.innerHTML.match(/([0-9]{1,}) Pack/i);
          addHiddenDiv('size', pack[0]);
          console.log(pack[0]);
        }
      });
    } catch (e) {
      console.log(e);
    };
    await new Promise(resolve => setTimeout(resolve, 10000));
    return await context.extract(productDetails, { transform });
  },
};
