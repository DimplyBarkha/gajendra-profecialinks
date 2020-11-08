async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { variants } = dependencies;
  var variantCount = await context.evaluate(async () => {
    return (document.querySelectorAll('#select-sku option').length) ? document.querySelectorAll('#select-sku option').length : 1;
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
        const variantIdXpath = '(//select[contains(@id,"select-sku")]//@value)[' + index + ']';
        addHiddenDiv('variant_id_text', getSingleText(variantIdXpath, document), `parent-${index}`);
        const variantUrlXpath = '(//select[contains(@id,"select-sku")]//@value)[' + index + ']';
        addHiddenDiv('variant_url_text', getSingleText(variantUrlXpath, document), `parent-${index}`);
      } else {
        const variantIdXpath = '//p[@d="block"]';
        addHiddenDiv('variant_id_text', getSingleText(variantIdXpath, document), `parent-${index}`);
        const variantUrlXpath = '//p[@d="block"]';
        addHiddenDiv('variant_url_text', getSingleText(variantUrlXpath, document), `parent-${index}`);
      }
    }, index, variantCount);
  }
  return await context.extract(variants);
}
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'BR',
    store: 'pontofrio',
    transform: null,
    domain: 'pontofrio.com.br',
    zipcode: '',
  },
  implementation,
};
