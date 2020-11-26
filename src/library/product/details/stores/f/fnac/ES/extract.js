const { transform } = require('../format');

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
      desc = desc.replace(/<li>/gm, ' || ').replace(/<.*?>/gm, '').replace(/&nbsp;/g, '').trim();
      addHiddenDiv('desc', desc);
    }

    let desc = document.querySelector('script[type="application/ld+json"]').innerText;
    desc = JSON.parse(desc);
    if (desc.brand) {
      addHiddenDiv('brandText', desc.brand.name);
    }
  });

  await new Promise((resolve) => setTimeout(resolve, 10000));
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
