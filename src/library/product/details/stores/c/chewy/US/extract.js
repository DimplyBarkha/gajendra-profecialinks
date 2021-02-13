const { transform } = require('../shared');
// const { transform } = require('../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  console.log('inputs:: ', inputs);
  const { url, id } = inputs;
  console.log('parameters:: ', parameters);
  if (id) {
    await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    await context.waitForXPath('//article//a');
    await context.waitForSelector('article> a');
    console.log('everything fine !!!');
    async function firstItemLink () {
      return await context.evaluate(function () {
        const firstItem = document.querySelector('article> a').href;
        return firstItem;
      });
    }
    const url = await firstItemLink();
    if (url !== null) {
      await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
    }

    // await context.evaluate(() => {
    //   const firstItem = document.querySelector('article> a');
    //   firstItem.click();
    // });
  }

  await new Promise((resolve, reject) => setTimeout(resolve, 5000));

  // await context.evaluate(async function () {
  //   function addHiddenDiv(id, content) {
  //     const newDiv = document.createElement('div');
  //     newDiv.id = id;
  //     newDiv.textContent = content;
  //     newDiv.style.display = 'none';
  //     document.body.appendChild(newDiv);
  //   }
  // });
  // await context.evaluate(async function () {
  //   function addHiddenDiv (id, content) {
  //     const newDiv = document.createElement('div');
  //     newDiv.id = id;
  //     newDiv.textContent = content;
  //     newDiv.style.display = 'none';
  //     document.body.appendChild(newDiv);
  //   }
  // });

  // await context.evaluate(function () {
  //   const myURL = document.createElement('li');
  //   myURL.classList.add('ii_url');
  //   myURL.textContent = window.location.href;
  //   myURL.style.display = 'none';
  //   document.body.append(myURL);
  // });

  // var variantLength = await context.evaluate(async () => {
  //   return (document.querySelectorAll('div.buybox-wrapper label.cw-form-button-toggle__label')) ? document.querySelectorAll('div.buybox-wrapper label.cw-form-button-toggle__label').length : 0;
  // });
  // console.log('variantLength:: ', variantLength);
  // if (variantLength > 1) {
  //   for (let j = 0; j < variantLength; j++) {
  //     await context.evaluate(async (j) => {
  //       return document.querySelectorAll('div.buybox-wrapper label.cw-form-button-toggle__label')[j].click();
  //     }, j);
  //     console.log('Inside variants', j);
  //     if (j !== variantLength - 1) { await context.extract(productDetails, { transform }, { type: 'APPEND' }); }
  //   }
  // }
  return await context.extract(productDetails, { transform });
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
