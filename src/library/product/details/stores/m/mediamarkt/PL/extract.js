const { transform } = require('./format');
/**
*
* @param { { url?: string, id?: string} } inputs
* @param { Record<string, any> } parameters
* @param { ImportIO.IContext } context
* @param { Record<string, any> } dependencies
*/
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async function () {
    function addHiddenDiv(id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    // If images are present in description then add to manufacturerDescription else add to description
    const manufacturerImageFlag = document.querySelector('div[id="description-product"] img');
    const descriptionSelector = document.querySelector('div[class="description-product"]');
    const description = descriptionSelector ? descriptionSelector.innerText : '';
    if (manufacturerImageFlag) {
      addHiddenDiv('added-manufacturerDesc', description);
    } else {
      addHiddenDiv('added-description', description);
    }
  });
  await new Promise(resolve => setTimeout(resolve, 10000));
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PL',
    store: 'mediamarkt',
    transform: transform,
    domain: 'mediamarkt.pl',
    zipcode: '',
  },
  implementation,
};
