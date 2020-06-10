// @ts-nocheck

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'otto',
    transform: null,
    domain: 'otto.de',
  },
  implementation: async ({ url }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      // @ts-ignore
      const dataObj = JSON.parse((document.querySelector('script#productDataJson').innerText).trim());
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      if (dataObj) {
        addElementToDocument('ot_id', dataObj.id);
        addElementToDocument('ot_brand', dataObj.brand);
        let gtinSelector = document.evaluate("//meta[contains(@itemprop,'gtin')]/@content", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        gtinSelector = gtinSelector ? `Article no. ${gtinSelector.innerText}` : '';
        let bulletDescription = document.evaluate('//ul[@class="prd_unorderedList"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        bulletDescription = bulletDescription ? bulletDescription.innerText : '';
        addElementToDocument('ot_description', `${gtinSelector} ${bulletDescription} ${dataObj.description}`);
        addElementToDocument('ot_variantID', Object.keys(dataObj.variations).length);
      }
      const prodData = dataObj.variations[dataObj.id];
      if (prodData) {
        addElementToDocument('ot_nameExtended', `${prodData.name} (${dataObj.id})`);
        addElementToDocument('ot_name', prodData.name);
        const availabilityText = document.evaluate("//div[@id='availability']/span[@class='soldout']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        availabilityText = availabilityText ? availabilityText.innerText.trim() : 'In den Warenkorb';
        addElementToDocument('ot_availabilityText', availabilityText);
      }
      const colorlement = document.evaluate("//div[contains(@class,'prd_color ')]//li[contains(@class,'p_selected')]/@style", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (colorlement && colorlement.value.indexOf('background-color') > -1) {
        const colorCode = colorlement.value.slice(colorlement.value.indexOf('#') + 1);
        addElementToDocument('ot_colorcode', colorCode);
      }
    });
    await context.extract(productDetails);
  },
};
