const { transform } = require('../format.js');
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  var descrLength = await context.evaluate(async () => {
      return (document.querySelectorAll('div.pdp-container.pdp-desktop-layout div.pdp-product-desc_text.pdp-step_title p')) ? document.querySelectorAll('div.pdp-container.pdp-desktop-layout div.pdp-product-desc_text.pdp-step_title p').length : 0;
  });
  await preparePage(0, descrLength, true);
  async function preparePage(index, descrLength) {
    await context.evaluate(async (index, descrLength) => {
      function addHiddenDiv(id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      async function infiniteScroll() {
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
      function getSingleText(xpath, document) {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        if (element && element.singleNodeValue) {
          const nodeElement = element.singleNodeValue;
          return nodeElement ? nodeElement.textContent : '';
        } else {
          return '';
        }
      }
      if(descrLength === 3){
          const descriptionXpath = '(//div[@class="pdp-container pdp-desktop-layout"]//div[@class="pdp-product-desc_text pdp-step_title"]//p)[1]';
          addHiddenDiv(`description_text`, getSingleText(descriptionXpath, document));
          const directionsXpath = '(//div[@class="pdp-container pdp-desktop-layout"]//div[@class="pdp-product-desc_text pdp-step_title"]//p)[2]';
          addHiddenDiv(`directions_text`, getSingleText(directionsXpath, document));
          const ingredientsListXpath = '(//div[@class="pdp-container pdp-desktop-layout"]//div[@class="pdp-product-desc_text pdp-step_title"]//p)[3]';
          addHiddenDiv(`ingredientsList_text`, getSingleText(ingredientsListXpath, document));
      }else if(descrLength === 2){
          const descriptionXpath = '(//div[@class="pdp-container pdp-desktop-layout"]//div[@class="pdp-product-desc_text pdp-step_title"]//p)[1]';
          addHiddenDiv(`description_text`, getSingleText(descriptionXpath, document));
          const ingredientsListXpath = '(//div[@class="pdp-container pdp-desktop-layout"]//div[@class="pdp-product-desc_text pdp-step_title"]//p)[2]';
          addHiddenDiv(`ingredientsList_text`, getSingleText(ingredientsListXpath, document));
      }
    }, index, descrLength);
  }
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'heb_78204',
    transform: transform,
    domain: 'heb.com',
    zipcode: '78204',
  },
  implementation,
};
