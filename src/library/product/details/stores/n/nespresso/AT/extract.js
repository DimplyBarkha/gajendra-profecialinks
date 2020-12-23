const { transform } = require('../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const imageSelector = document.querySelector('div.coffeecuppicture');
    if (imageSelector) {
      const imageUrl = imageSelector.getAttribute('style').match('"(.+)?"')[0].replace(/"/g, '');
      addHiddenDiv('constructedImageUrl', imageUrl);
    }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: 'nespresso',
    transform: transform,
    domain: 'nespresso.com',
    zipcode: '',
  },
  implementation,
};
