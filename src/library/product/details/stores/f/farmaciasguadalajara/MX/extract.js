const { cleanUp } = require('../../../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
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
    const url = window.location.href;
    addElementToDocument('pd_url', url);
    // @ts-ignore
    
    });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'MX',
    store: 'farmaciasguadalajara',
    transform: cleanUp,
    domain: 'farmaciasguadalajara.com',
    zipcode: '',
  },
  implementation,
};
