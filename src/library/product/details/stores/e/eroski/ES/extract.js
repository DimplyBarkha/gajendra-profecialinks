//const { transform } = require('../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await new Promise((resolve, reject) => setTimeout(resolve, 10000));
  await context.waitForXPath('//h2[@role="presentation"]//a');

  await context.waitForSelector('h2[role=presentation] a');
  console.log('everything fine !!!');
  await context.evaluate(() => {
    const firstItem = document.querySelector('h2[role=presentation] a');
    firstItem.click();
  });

  await new Promise((resolve, reject) => setTimeout(resolve, 10000));

  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    const variantIdEl = document.querySelector('div > div.container-big-image > img');
    if (variantIdEl && variantIdEl.src) {
      let variantIdText = variantIdEl.src;
      if (variantIdText.includes('https')) {
        variantIdText = variantIdText.replace('https://supermercado.eroski.es/images/', '');
        variantIdText = variantIdText.replace('.jpg', '');
      }
      addHiddenDiv('my-variantId', variantIdText);
    }
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'eroski',
    transform: null,
    domain: 'supermercado.eroski.es',
    zipcode: '',
  },
  implementation,
};
