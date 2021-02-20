// const { transform } = require('../shared');
const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await new Promise((resolve, reject) => setTimeout(resolve, 4000));

  await context.evaluate(async ()  => {
    for (let index = 0; index < 7; index++) {
      const morButtonSel = document.querySelector('div.show-more div.text-center button.btn-tertiary');
      if (morButtonSel) {
        // console.log('going to click now');
        morButtonSel.click();
        await new Promise((resolve, reject) => setTimeout(resolve, 6000));
        // console.log('clicked now------÷---');
      }        
    }
  });

  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'foodsaver',
    transform: transform,
    domain: 'foodsaver.com',
    zipcode: '',
  },
  implementation,
};
