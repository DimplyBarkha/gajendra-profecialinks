const { transform } = require('../format');
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  // await new Promise((resolve) => setTimeout(resolve, 20000));
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async () => {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const descContent = (document.querySelector('div.ProductDetail__productContent')) ? document.querySelector('div.ProductDetail__productContent').innerHTML.replace(/<li>/gm, ' || ').replace(/<.*?>/gm, '').replace(/\n/gm, ' ').replace(/•/gm, ' ||').replace(/\s{2,}/, ' ').trim() : '';
    descContent && addHiddenDiv('ii_description', descContent);
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'ulta',
    transform,
    domain: 'ulta.us',
    zipcode: '',
  },
};
