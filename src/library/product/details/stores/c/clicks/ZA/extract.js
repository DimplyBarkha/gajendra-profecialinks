const { transform } = require('../shared');
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  console.log("inputs:: ", inputs);
  const { id } = inputs;
  console.log("parameters:: ", parameters);
  if (id) {
    await new Promise((resolve, reject) => setTimeout(resolve, 10000));
    await context.waitForXPath('//div[@class="productBlock"]/a');

    await context.waitForSelector('div.productBlock a');
    console.log('everything fine !!!');
    await context.evaluate(() => {
      const firstItem = document.querySelector('div.productBlock a');
      firstItem.click();
    });

    await new Promise((resolve, reject) => setTimeout(resolve, 10000));

    // await context.evaluate(async function () {
    //   function addHiddenDiv (id, content) {
    //     const newDiv = document.createElement('div');
    //     newDiv.id = id;
    //     newDiv.textContent = content;
    //     newDiv.style.display = 'none';
    //     document.body.appendChild(newDiv);
    //   }    
    // });
  }
  // var variantLength = await context.evaluate(async () => {
  //   return (document.querySelectorAll('div.variant_options a.colorVariant')) ? document.querySelectorAll('div.variant_options a.colorVariant').length : 0;
  // });
  // console.log("variantLength:: ", variantLength);
  // if (variantLength > 1) {
  //   for (let j = 0; j < variantLength; j++) {
  //     await context.evaluate(async (j) => {
  //       return document.querySelectorAll('a.colorVariant')[j].click();
  //     }, j);
  //     console.log('Inside variants', j);
  //     if (j !== variantLength - 1) { await context.extract(productDetails, { transform }, { type: 'APPEND' }); }
  //   }
  // }
  // var variantLength1 = await context.evaluate(async () => {
  //   return (document.querySelectorAll('div.selectric-scroll li:not(:first-child)')) ? document.querySelectorAll('div.selectric-scroll li:not(:first-child)').length : 0;
  // });
  // console.log("variantLength1:: ", variantLength1);
  // if (variantLength1 > 1) {
  //   for (let j = 0; j < variantLength1; j++) {
  //     await context.evaluate(async (j) => {
  //       return document.querySelectorAll('div.selectric-scroll li:not(:first-child)')[j].click();
  //     }, j);
  //     console.log('Inside variants', j);
  //     if (j !== variantLength1 - 1) { await context.extract(productDetails, { transform }, { type: 'APPEND' }); }
  //   }
  // }
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ZA',
    store: 'clicks',
    transform: transform,
    domain: 'clicks.co.za',
    zipcode: '',
  },
  implementation,
};