const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'LU',
    store: 'hifi',
    transform,
    domain: 'hifi.lu',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      try {
        // @ts-ignore
        const dataObj = window.__data && window.__data.product && window.__data.product;
        if (dataObj) {
          dataObj.product && dataObj.product.averageRating && addElementToDocument('pd_rating', dataObj.product.averageRating);
          // if (dataObj.productVariants) {
          //   addElementToDocument('pd_variantCount', dataObj.productVariants[0].options.length);
          //   dataObj.productVariants[0].options.forEach(item => {
          //     addElementToDocument('pd_variants', item.product.code);
          //   });
          // }
        }
      } catch (error) {
        console.log('add element to document failed!!');
      }
    });

    try {
      await context.click('a.brand-content-link');
    } catch (err) {
      console.log('no link found');
    }

    try {
      await context.waitForSelector('#loadbeeIframeId');
    } catch (err) {
      console.log('no link found');
    }
    const src = await context.evaluate(async function () {
      const iframe = document.querySelector('#loadbeeIframeId');
      // @ts-ignore
      const src = iframe ? iframe.src : '';
      return src;
    });
    await context.extract(productDetails, { transform });
    if (src) {
      try {
        await context.goto(src, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
        await context.waitForSelector('div.wrapper.preview');
        return await context.extract(productDetails, { type: 'MERGE_ROWS', transform });
      } catch (error) {
        try {
          await context.evaluate(async function (src) {
            window.location.assign(src);
          }, src);
          await context.waitForSelector('div.wrapper.preview');
          return await context.extract(productDetails, { type: 'MERGE_ROWS', transform });
        } catch (err) {
          console.log(err);
        }
      }
    }
  },
};
