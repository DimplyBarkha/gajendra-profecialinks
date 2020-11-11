const { transform } = require('../shared');

//const { transform } = require('../shared');
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  console.log("inputs:: ", inputs);
  const { url, id } = inputs;
  console.log("parameters:: ", parameters);
  if (id) {
    await new Promise((resolve, reject) => setTimeout(resolve, 10000));
    await context.waitForXPath('//article//a');

    await context.waitForSelector('article> a');
    console.log('everything fine !!!');
    await context.evaluate(() => {
      const firstItem = document.querySelector('article> a');
      firstItem.click();
    });

    await new Promise((resolve, reject) => setTimeout(resolve, 10000));

    await context.evaluate(async function () {
      function addHiddenDiv(id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
    });
  var variantLength = await context.evaluate(async () => {
      return (document.querySelectorAll('div.cw-form-button-toggle__wrapper label')) ? document.querySelectorAll('div.cw-form-button-toggle__wrapper label').length : 0;
    });
    console.log("variantLength:: ", variantLength);
    if (variantLength > 1) {
      // await preparePageForCommonElement(0, variantLength);
      for (let j = 0; j < variantLength; j++) {
        await context.evaluate(async (j) => {
          return document.querySelectorAll('label.cw-form-button-toggle__label')[j].click();
        }, j);
        // await context.click(`ul.topic li label`);
        console.log('Inside variants', j);
        // await preparePage(j, variantLength);
        if (j !== variantLength - 1) { await context.extract(productDetails, { transform }, { type: 'APPEND' }); }
      }
    };
    return await context.extract(productDetails, { transform });
  }
}
  module.exports = {
    implements: 'product/details/extract',
    parameterValues: {
      country: 'US',
      store: 'chewy',
      transform: transform,
      domain: 'chewy.com',
      zipcode: '',
    },
    implementation,
  };
