/* eslint-disable promise/param-names */
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
      const tabWithDetails = document.evaluate(
        '//ul[contains(@class,"nav") and contains(@class,"nav-tabs")]/li/a[contains(.,"Details") or contains(.,"details")]',
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      );
      console.log('tabWithDetails: ' + tabWithDetails);
      // @ts-ignore
      if (tabWithDetails && tabWithDetails.singleNodeValue) {
        tabWithDetails.singleNodeValue.click();

        // @ts-ignore
        await new Promise((resolve, reject) => setTimeout(resolve, 3000));
        const getProductDetails = [...document.querySelectorAll('.tab-pane.active ul>li')];
        // const getProductDetails = document.querySelectorAll('ul.b-details-product__list li');
        const productDetails = [];
        for (let i = 0; i < getProductDetails.length; i++) {
          // @ts-ignore
          const key = getProductDetails[i].querySelector('.list-item-label') && getProductDetails[i].querySelector('.list-item-label').innerText ? getProductDetails[i].querySelector('.list-item-label').innerText : "";
          // @ts-ignore
          const value = getProductDetails[i].querySelector('.list-item-text') && getProductDetails[i].querySelector('.list-item-text').innerText ? getProductDetails[i].querySelector('.list-item-text').innerText : "";
          const data = key + ' : ' + value;
          productDetails.push(data);
        }
        const details = productDetails.join(' || ');
        document.body.setAttribute('details', details);
      } else {
        console.log("Details section isn't available.")
      }

      // Get productOtherInformation with pipes
      const getOtherInfo = document.querySelectorAll('div.b-composition-product ul li');
      const productInfo = [];
      for (let i = 0; i < getOtherInfo.length; i++) {
        // @ts-ignore
        if (getOtherInfo[i] && getOtherInfo[i].innerText) {
          productInfo.push(getOtherInfo[i].innerText.trim());
        }
      }
      const productinfo = productInfo.join(' || ');
      document.body.setAttribute('productinfo', productinfo);
      // Delay required for loading video link
      await new Promise(function (resolve, reject) {
        setTimeout(() => resolve('done'), 8000);
      });
    });
    await context.extract(productDetails);
  },
};
