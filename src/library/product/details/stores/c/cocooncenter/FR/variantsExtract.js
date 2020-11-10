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
      if (!document.querySelector('div.variation_selector_img_items'))
      {
        var URL = window.location.href;
        var varinatId = document.querySelector('div[data-bv-show="reviews"]').getAttribute('data-bv-product-id');
            
        const newDiv = document.createElement('div');
        newDiv.className = 'variation_selector_img_items';
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);

        const variantDiv = document.createElement('div');
        variantDiv.setAttribute('data-attribut', varinatId);
        variantDiv.style.display = 'none';
        newDiv.appendChild(variantDiv);

        const urlDiv = document.createElement('a');
        urlDiv.setAttribute('href', URL);
        urlDiv.style.display = 'none';
        variantDiv.appendChild(urlDiv);
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
    country: 'FR',
    store: 'cocooncenter',
    transform,
    domain: 'cocooncenter.com',
    zipcode: "''",
  },
  implementation
};
