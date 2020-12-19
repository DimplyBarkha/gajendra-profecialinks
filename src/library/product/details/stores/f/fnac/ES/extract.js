const { transform } = require('./format');
async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  // If cookie pop up appears then clicking on accept button
  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    if (document.querySelector('div.productStrate__raw')) {
      let desc = document.querySelector('div.productStrate__raw').innerHTML;
      desc = desc.replace(/<li>/gm, ' || ').replace(/<(style|script|noscript)\b[^<]*(?:(?!<\/(style|script|noscript)>)<[^<]*)*<\/(style|script|noscript)>/g, '').replace(/(<([^>]+)>)/ig, '').replace(/&nbsp;/g, '').trim();
      const descriptions = desc.split(/([|]{2,}|Especificaciones)/);
      addHiddenDiv('desc', descriptions[0]);
    }

    const text = document.querySelector('script[type="application/ld+json"]').innerText;
    const json = JSON.parse(text);
    if (json.brand) {
      addHiddenDiv('brandText', json.brand.name);
    }
  });

  // await new Promise((resolve) => setTimeout(resolve, 10000));
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'fnac',
    transform,
    domain: 'fnac.es',
    zipcode: '',
  },
  implementation,
};
