const { transform } = require('./variantFormat');

async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { createUrl, variants } = dependencies;
  await new Promise((resolve, reject) => setTimeout(resolve, 6000));

  const getMainVariant = async function (context) {
    await context.evaluate(async function () {
      if (!document.querySelector('div.product-attributes__group'))
      {
        var URL = window.location.href;
            
        const newDiv = document.createElement('div');
        newDiv.className = 'product-attributes__group';
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);

        const variantDiv = document.createElement('div');
        variantDiv.setAttribute('data-action-id', URL);
        variantDiv.style.display = 'none';
        newDiv.appendChild(variantDiv);
      }
    }, createUrl);
  };

  await getMainVariant(context);
  await new Promise((resolve, reject) => setTimeout(resolve, 6000));
  return await context.extract(variants, {transform});
}

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'HU',
    store: 'mediamarkt',
    transform,
    domain: 'mediamarkt.hu',
    zipcode: "''",
  },
  implementation
};
