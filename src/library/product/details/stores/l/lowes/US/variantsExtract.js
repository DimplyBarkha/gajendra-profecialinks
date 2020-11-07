async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { variants } = dependencies;
  var variantCount = await context.evaluate(async () => {
    return (document.querySelectorAll('div.false.swatchWrapper button').length) ? document.querySelectorAll('div.false.swatchWrapper button').length : 1;
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
      async function infiniteScroll () {
        let prevScroll = document.documentElement.scrollTop;
        while (true) {
          window.scrollBy(0, document.documentElement.clientHeight);
          await new Promise(resolve => setTimeout(resolve, 1000));
          const currentScroll = document.documentElement.scrollTop;
          if (currentScroll === prevScroll) {
            break;
          }
          prevScroll = currentScroll;
        }
      }
      await infiniteScroll();
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
        const variantXpath = '(//div[contains(@class,"swatchWrapper")]//button//a)[' + index + ']';
        addHiddenDiv('variant_name_text', getSingleText(variantXpath, document), `parent-${index}`);
        const skuXpath = '(//div[contains(@class,"swatchWrapper")]//button/@data-url)[' + index + ']';
        addHiddenDiv('variant_sku_text', getSingleText(skuXpath, document), `parent-${index}`);
        const variantUrlXpath = '(//div[contains(@class,"swatchWrapper")]//button/@data-url)[' + index + ']';
        addHiddenDiv('variant_url_text', getSingleText(variantUrlXpath, document), `parent-${index}`);
      } else {
        const variantXpath = '//h3[@class="met-pvs-swatch-selection"]';
        addHiddenDiv('variant_name_text', getSingleText(variantXpath, document), `parent-${index}`);
        const skuXpath = '//link[@rel="canonical"]/@href';
        addHiddenDiv('variant_sku_text', getSingleText(skuXpath, document), `parent-${index}`);
        const variantUrlXpath = '//link[@rel="canonical"]/@href';
        addHiddenDiv('variant_url_text', getSingleText(variantUrlXpath, document), `parent-${index}`);
      }
    }, index, variantCount);
  }
  return await context.extract(variants);
}
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'US',
    store: 'lowes',
    transform: null,
    domain: 'lowes.com',
    zipcode: '',
  },
  implementation,
};
