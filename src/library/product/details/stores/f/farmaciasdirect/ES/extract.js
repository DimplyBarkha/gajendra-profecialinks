const { cleanUp } = require('../../../../shared');

const implementation = async (inputs, parameters, context, dependencies) => {
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

    addHiddenDiv('my-url', window.location.href);

    const packText = document.evaluate("concat(//section[@class='product-features']//dd[@class='value'],//section[@class='product-features']//dt[@class='name'])", document, null, XPathResult.STRING_TYPE, null).stringValue.replace('Presentacion', '');

    addHiddenDiv('my-pack', packText);
  });

  return await context.extract(productDetails, { transform });
};

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'farmaciasdirect',
    transform: cleanUp,
    domain: 'farmaciasdirect.com',
    zipcode: '28001',
  },
  implementation,
};
