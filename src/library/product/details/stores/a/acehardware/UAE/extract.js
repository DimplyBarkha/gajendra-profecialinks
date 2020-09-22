const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UAE',
    store: 'acehardware',
    transform: transform,
    zipcode: '',
    domain: 'aceuae.com',
  },
  // @ts-ignore
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      // Get specification with pipes
      const getProductDetails = document.querySelectorAll('ul.b-details-product__list li');
      const productDetails = [];
      for (let i = 0; i < getProductDetails.length; i++) {
        // @ts-ignore
        const key = getProductDetails[i].querySelector('div.b-attributes__label').innerText;
        // @ts-ignore
        const value = getProductDetails[i].querySelector('div.b-attributes__attr').innerText;
        const data = key + ' : ' + value;
        productDetails.push(data);
      }
      const details = productDetails.join(' || ');
      document.body.setAttribute('details', details);
      // Get productOtherInformation with pipes
      const getOtherInfo = document.querySelectorAll('div.b-composition-product ul li');
      const productInfo = [];
      for (let i = 0; i < getOtherInfo.length; i++) {
        // @ts-ignore
        productInfo.push(getOtherInfo[i].innerText.trim());
      }
      const productinfo = productInfo.join(' || ');
      document.body.setAttribute('productinfo', productinfo);
      await new Promise(r => setTimeout(r, 5000));
    });
    await context.extract(productDetails);
  },
};
