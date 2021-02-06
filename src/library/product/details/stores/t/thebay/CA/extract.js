const { transform } = require('../format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'thebay',
    transform,
    domain: 'thebay.com',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const variantCount = await context.evaluate(async function () {
      return document.querySelectorAll('ul.selection-list.ps > li').length;
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;

    try {
      await context.click('span#consent-close');
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.log(error);
    }
    console.log('run variants....');
    await context.extract(productDetails, { transform });
    for (let index = 2; index <= variantCount; index++) {
      try {
        const status = await context.evaluate(async function (index) {
          const sel = `ul.selection-list li:not(.option-disabled):nth-child(${index})`;
          document.querySelector(sel) && document.querySelector(sel).click();
          return document.querySelector(sel);
        }, index);

        // await context.click(`ul.selection-list.ps.ps--active-y li:not(.option-disabled):nth-child(${index})`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (variantCount !== index) {
          if (status) {
            await context.extract(productDetails, { type: 'APPEND', transform });
          }
        } else {
          return await context.extract(productDetails, { type: 'APPEND', transform });
        }
      } catch (error) {
        console.log('Error While itrerating over the variants', error);
      }
    }
    const variantCount2 = await context.evaluate(async function () {
      return document.querySelectorAll('ul.size-attribute > li').length;
    });
    console.log('run variants....');
    for (let index = 2; index <= variantCount2; index++) {
      try {
        const status = await context.evaluate(async function (index) {
          const sel = `ul.size-attribute li:not([disabled="disabled"]):nth-child(${index})`;
          document.querySelector(sel) && document.querySelector(sel).click();
          return document.querySelector(sel);
        }, index);

        // await context.click(`ul.selection-list.ps.ps--active-y li:not(.option-disabled):nth-child(${index})`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (variantCount2 !== index) {
          if (status) {
            await context.extract(productDetails, { type: 'APPEND', transform });
          }
        } else {
          return await context.extract(productDetails, { type: 'APPEND', transform });
        }
      } catch (error) {
        console.log('Error While itrerating over the variants', error);
      }
    }
  },
};
