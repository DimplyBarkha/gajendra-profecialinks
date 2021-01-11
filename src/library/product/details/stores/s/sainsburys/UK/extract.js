const { transform } = require('./format');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  try {
    await context.waitForSelector('script[type="application/ld+json"]', { timeout: 10000 });
  } catch (e) {
    console.log('script not loaded');
  }
  await context.evaluate(async () => {
    function addHiddenDiv (elementID, content) {
      const newDiv = document.createElement('div');
      newDiv.className = elementID;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const element = document.querySelector('div.ln-o-page__body');
      element.appendChild(newDiv);
    }

    try {
      const script = document.querySelector('script[type="application/ld+json"]');
      const scriptContent = JSON.parse(script.textContent);
      var priceCurrency = scriptContent.offers.priceCurrency;
      addHiddenDiv('custom_priceCurrency', priceCurrency);
    } catch (e) {
      console.log('error in read script');
    }

    const urlParams = new URLSearchParams(window.location.search);
    const customSku = urlParams.get('productId');
    var url = window.location.href;
    addHiddenDiv('custom_sku', customSku);
    addHiddenDiv('product_custom_url', url);
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
