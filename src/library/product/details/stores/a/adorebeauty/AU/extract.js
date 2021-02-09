const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'adorebeauty',
    transform,
    domain: 'adorebeauty.com.au',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const variantCount = await context.evaluate(async function () {
      return document.querySelectorAll('ul.product-palette > li.product-palette__item > button').length;
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    const attributeOptions = await context.evaluate(async function () {
      return window && window.__NUXT__ && window.__NUXT__.data[0] && window.__NUXT__.data[0].product && window.__NUXT__.data[0].product.attributeOptions ? window.__NUXT__.data[0].product.attributeOptions : null;
    });
    const singleSKU = await context.evaluate(async function () {
      return window && window.__NUXT__ && window.__NUXT__.data[0] && window.__NUXT__.data[0].product && window.__NUXT__.data[0].product ? window.__NUXT__.data[0].product : null;
    });

    await context.evaluate(async function () {
      const descrList = document.querySelectorAll('div[itemprop="description"] li');
      [...descrList].forEach((ele) => {
        ele.insertAdjacentHTML('afterbegin', '<span style="display: none">|| </div>');
      });
    });

    await context.evaluate(async function (attributeOptions, singleSKU) {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      console.log('singleSKU dsdsd');
      console.log(singleSKU)
      const attribute = document.querySelector('ul.product-palette > li.product-palette__item:nth-child(1)');
      if (attributeOptions && attribute) {
        const altImg = attribute ? attribute.querySelector('img').getAttribute('alt') : '';
        if (altImg.length) {
          const jsonData = attributeOptions[altImg];
          attribute.setAttribute('ii_variantId', jsonData && jsonData.product_id ? jsonData.product_id : '');
          attribute.setAttribute('ii_sku', jsonData && jsonData.productSku && jsonData.productSku[0] ? jsonData.productSku[0] : '');
        }
      } else if (singleSKU) {
        addHiddenDiv('ii_single_variantId', singleSKU && singleSKU.productId ? singleSKU.productId : '');
        addHiddenDiv('ii_single_sku', singleSKU && singleSKU.productSku && singleSKU.productSku[0] ? singleSKU.productSku[0] : '');
      }
    }, attributeOptions, singleSKU);
    await context.extract(productDetails, { transform });
    for (let index = 2; index <= variantCount; index++) {
      try {
        await context.evaluate(() => document.querySelectorAll('div[data-wps-popup-close-intent]').forEach(elm => elm.click()));
        await context.click(`ul.product-palette > li.product-palette__item:nth-child(${index}) > button`);
        await new Promise(resolve => setTimeout(resolve, 500));

        await context.evaluate(async function (attributeOptions, index) {
          if (attributeOptions) {
            const attribute = document.querySelector(`ul.product-palette > li.product-palette__item:nth-child(${index})`);
            const altImg = attribute ? attribute.querySelector('img').getAttribute('alt') : '';
            if (altImg.length) {
              const jsonData = attributeOptions[altImg];
              attribute.setAttribute('ii_variantId', jsonData && jsonData.product_id ? jsonData.product_id : '');
              attribute.setAttribute('ii_sku', jsonData && jsonData.productSku && jsonData.productSku[0] ? jsonData.productSku[0] : '');
            }
          }
        }, attributeOptions, index);
        if (variantCount !== index) {
          await context.evaluate(() => document.querySelectorAll('div[data-wps-popup-close-intent]').forEach(elm => elm.click()));
          await context.extract(productDetails, { type: 'APPEND', transform });
        } else {
          return await context.extract(productDetails, { type: 'APPEND', transform });
        }
      } catch (error) {
        console.log('Error While itrerating over the variants');
      }
    }
  },
};
