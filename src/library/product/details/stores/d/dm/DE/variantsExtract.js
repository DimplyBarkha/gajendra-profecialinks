const { transform } = require('./variantsFormat.js');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { variants } = dependencies;
  var variantCount = await context.evaluate(async () => {
    return (document.querySelectorAll('div[data-dmid="product-variants-selection-container"] div[data-dmid="color-circle-button"]').length) ? document.querySelectorAll('div[data-dmid="product-variants-selection-container"] div[data-dmid="color-circle-button"]').length : 1;
  });
  for (var i = 0; i < variantCount; i++) {
    await preparePage(i + 1, variantCount, true);
    // if (i !== variantCount - 1) { return await context.extract(variants, { type: 'APPEND' }); }
  }
  async function preparePage (index, variantCount) {
    await context.evaluate(async (index, variantCount) => {
      function addHiddenDiv (id, content, parentId = null) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        if (parentId && parentId.length) {
          document.body.querySelector(`#${parentId}`).appendChild(newDiv);
        } else {
          newDiv.class = 'parent';
          document.body.appendChild(newDiv);
        }
      }
      function getSingleText (xpath, document) {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        if (element && element.singleNodeValue) {
          const nodeElement = element.singleNodeValue;
          return nodeElement && nodeElement.textContent.trim().length > 1 ? nodeElement.textContent : '';
        } else {
          return '';
        }
      }
      // Adding parent div
      addHiddenDiv(`parent-${index}`, '');
      if (variantCount > 1) {
        const variantUrlXpath = '(//div[@data-dmid="product-variants-selection-container"]//div/a/@href)[' + index + ']';
        addHiddenDiv('variant_url_text', getSingleText(variantUrlXpath, document), `parent-${index}`);
      } else {
        const variantUrlXpath = '//div[@data-dmid="main-section-attributes-container"]/div/a/@href';
        addHiddenDiv('variant_url_text', getSingleText(variantUrlXpath, document), `parent-${index}`);
      }
    }, index, variantCount);
  }
  return await context.extract(variants, { transform });
}

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'DE',
    store: 'dm',
    transform: transform,
    domain: 'dm.de',
    zipcode: '',
  },
  implementation,
};
