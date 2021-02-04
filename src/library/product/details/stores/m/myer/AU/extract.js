const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'myer',
    transform,
    domain: 'myer.com.au',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const variantCount = await context.evaluate(async function () {
      return document.querySelectorAll('ul.css-111qmqk > li').length;
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;

    try {
      await context.click('ul.css-111qmqk > li > button.css-1qfcket.css-z4sq4c');
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.log(error);
    }

    await context.extract(productDetails, { transform });
    for (let index = 2; index <= variantCount; index++) {
      try {
        const status = await context.evaluate(async function (index) {
          const sel = `ul.css-111qmqk > li > button.css-1qfcket.css-z4sq4c:nth-child(${index})`;
          document.querySelector(sel) && document.querySelector(sel).click();
          return document.querySelector(sel);
        }, index);

        //await context.click(`ul.selection-list.ps.ps--active-y li:not(.option-disabled):nth-child(${index})`);
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
  },
};
