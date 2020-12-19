async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { variants } = dependencies;
  await new Promise(resolve => setTimeout(resolve, 5000));
  // await context.evaluate(async () => {
  // const variantTab = document.evaluate("//div[@class='ProductTabs']//div[contains(@class, 'product-details')]//ul[contains(@class, 'react-tabs')]//li[contains(text(), 'Product Variants')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
  // if (variantTab && variantTab.singleNodeValue) {
  // variantTab.singleNodeValue.click();
  // await new Promise(resolve => setTimeout(resolve, 3000));
  // }
  // })

  var variantCount = await context.evaluate(async () => {
    return (document.querySelectorAll('.variations__tiles .variations__container a').length) ? document.querySelectorAll('.variations__tiles .variations__container a').length : 1;
  });
  for (var i = 0; i < variantCount; i++) {
    await preparePage(i + 1, variantCount);
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
        // const variantXpath = '(//div[@class="pdp-top grid-x"]//div[@class="cell auto grid-y"]//div//@data-id)[' + index + ']';
        // addHiddenDiv('variant_id_text', getSingleText(variantXpath, document), `parent-${index}`);
        // const skuXpath = '(//div[@class="rt-td"]//@href)[' + index + ']';
        // addHiddenDiv('variant_sku_text', getSingleText(skuXpath, document), `parent-${index}`);
        const variantUrlXpath = '(//link[@rel="canonical"]//@href)[' + index + ']';
        addHiddenDiv('variant_url_text', getSingleText(variantUrlXpath, document), `parent-${index}`);
      } else {
        // const variantXpath = '//div[@class="pdp-top grid-x"]//div[@class="cell auto grid-y"]//div//@data-id';
        // addHiddenDiv('variant_id_text', getSingleText(variantXpath, document), `parent-${index}`);
        // const skuXpath = '//h2[@class="productCodeSku"]//span[@data-e2e="productSku"]';
        // addHiddenDiv('variant_sku_text', getSingleText(skuXpath, document), `parent-${index}`);
        const variantUrlXpath = '//link[@rel="canonical"]//@href';
        addHiddenDiv('variant_url_text', getSingleText(variantUrlXpath, document), `parent-${index}`);
      }
    }, index, variantCount);
  }
  return await context.extract(variants);
}
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'DE',
    store: 'check24',
    transform: null,
    domain: 'check24.de',
    zipcode: '',
  },
  implementation,
};
