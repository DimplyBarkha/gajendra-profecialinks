// const { transform } = require('../CA/variantFormat');
const { transform } = require('./variantTransform');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { variants } = dependencies;

  await context.evaluate(() => {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    const jsonText = document.evaluate('//script[@type="application/ld+json" and contains(text(),"sku")]', document, null, XPathResult.STRING_TYPE, null).stringValue;

    const variantsObj = JSON.parse(jsonText);

    variantsObj.offers.forEach(variant => {
      addHiddenDiv('variant-sku', variant.sku);
    });
  });

  return await context.extract(variants, { transform });
}

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'CA',
    store: 'sephora',
    transform,
    domain: 'sephora.ca',
    zipcode: '',
  },
  implementation,
};
