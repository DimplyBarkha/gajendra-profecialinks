const { transform } = require('../format.js');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  var variantLength = await context.evaluate(async () => {
    return (document.querySelectorAll('table[id*="product_combinations"] tr')) ? document.querySelectorAll('table[id*="product_combinations"] tr').length : 0;
  });
  console.log('Variant Length', variantLength);
  if (variantLength > 1) {
    for (let j = 0; j < variantLength; j++) {
      await preparePage(j, variantLength);
      console.log('Inside variants', j);
      if (j !== variantLength - 1) { await context.extract(productDetails, { transform }); }
    }
  }
  async function preparePage (index, variantLength) {
    await context.evaluate(async (index, variantLength) => {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
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
          return nodeElement ? nodeElement.textContent : '';
        } else {
          return '';
        }
      }
      // @ts-ignore
      let xpathIndex = 1;
      xpathIndex = xpathIndex + index;
      const variantIdXpath = "(//td[contains(@class, 'tab-img-td')]//img//@title)[" + xpathIndex + ']';
      addHiddenDiv('ii_variantId', getSingleText(variantIdXpath, document));
      const nameExtendedXpath = "(//tr//td[contains(@class, 'tab-attribute-td')])[" + xpathIndex + ']';
      addHiddenDiv('ii_nameExtended', getSingleText(nameExtendedXpath, document));
      const listPriceXpath = "(//span[@class='price_without_reduction'])[" + xpathIndex + ']';
      addHiddenDiv('ii_listPrice', getSingleText(listPriceXpath, document));
      const promotionXpath = "(//span[@class='reduction'])[" + xpathIndex + ']';
      addHiddenDiv('ii_promotion', getSingleText(promotionXpath, document));
      const priceXpath = "(//table[contains(@id,'product_combinations')]//tr[contains(@class,'product-combinations-line')]//td[contains(@class,'tab-price-td')])[" + xpathIndex + ']';
      addHiddenDiv('ii_price', getSingleText(priceXpath, document));
      const quantityXpath = "(//tr//td//span[@class='combination'])[" + xpathIndex + ']';
      addHiddenDiv('ii_quantity', getSingleText(quantityXpath, document));
      const availabilityTextXpath = "(//td[@class='tab-add-td clearfix']//a)[" + xpathIndex + ']';
      addHiddenDiv('ii_availabilityText', getSingleText(availabilityTextXpath, document));
    }, index, variantLength);
  }
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'kalista-parfums',
    transform: transform,
    domain: 'kalista-parfums.com',
    zipcode: '',
  },
  implementation,
};
