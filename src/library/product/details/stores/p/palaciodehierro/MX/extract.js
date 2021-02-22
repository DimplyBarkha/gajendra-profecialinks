const { transform } = require('./transform');
/**
 *
 * @param { { url?: string,  id?: string} } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(() => {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const descNode = (document.querySelectorAll("div[class*='b-product_description-short'] , div[class*='b-product_description-specifications']")) ? document.querySelectorAll("div[class*='b-product_description-short'] , div[class*='b-product_description-specifications'] ul") : null;
    const descContent = [];
    for (let i = 0; i < descNode.length; i++) {
      const element = descNode[i];
      descContent.push(element.innerHTML.replace(/<li.*?>/gm, ' || ').replace(/\n/gm, ' ').replace(/<script>.*?<\/script>/gm, '').replace(/<style.*?<\/style>/gm, '').replace(/<.*?>/gm, ' ').replace(/•/gm, ' ||').replace(/\s{2,}/, ' ').trim());
    };
    addHiddenDiv('ii_description', descContent.join(' ').replace(/\s{2,}/, ' ').trim());
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'MX',
    store: 'palaciodehierro',
    transform,
    domain: 'elpalaciodehierro.com',
    zipcode: '',
  },
  implementation,
};
