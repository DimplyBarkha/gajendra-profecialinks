
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
    await context.evaluate(() => {
      Array.from(document.querySelectorAll('[data-at="sku_item_brand"],[data-at="product_brand_label"]')).forEach(elm => elm.innerText = elm.innerText + ' ');
    });
  } catch (err) {
    console.log('Error adding UPDP spacing');
  }

  await context.evaluate(() => {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    const jsonText = document.evaluate('//script[@type="application/ld+json" and contains(text(),"sku")]', document, null, XPathResult.STRING_TYPE, null).stringValue;
    if (jsonText) {
      const variantsObj = JSON.parse(jsonText);
      if (variantsObj) {
        let allVariants = '';
        variantsObj.offers.forEach((variant, index) => {
          index === 0 ? allVariants += variant.sku : allVariants += ` | ${variant.sku}`;
        });
        addHiddenDiv('variant-skus', allVariants);
      }
    }
  });

  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'sephora',
    transform,
    domain: 'sephora.ca',
    zipcode: '',
  },
  implementation,
};
