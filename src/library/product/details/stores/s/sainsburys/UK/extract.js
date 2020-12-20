const { transform } = require('./format');
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async () => {
    function addHiddenDiv(elementID, content) {
      const newDiv = document.createElement('div');
      newDiv.className = elementID;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const element = document.querySelector('div.ln-c-card.ln-c-card--soft')
      element.appendChild(newDiv);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const custom_sku = urlParams.get('productId');
    var url = window.location.href;
    addHiddenDiv("custom_sku", 'sainsburys_' + custom_sku);
    addHiddenDiv("product_custom_url", url);
  });
  return await context.extract(productDetails, { transform });
}


module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'sainsburys',
    transform: transform,
    domain: 'sainsburys.co.uk',
    zipcode: '',
  },
  implementation,
};