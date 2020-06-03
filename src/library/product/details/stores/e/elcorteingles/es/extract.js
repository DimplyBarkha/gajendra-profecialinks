
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'es',
    store: 'elcorteingles',
    transform: null,
    domain: 'elcorteingles.es',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
  await context.evaluate(async function () {
    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }

    function findJsonObj (scriptSelector, startString, endString) {
      const xpath = `//script[contains(.,'${scriptSelector}')]`;
      const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      const scriptContent = element.innerText;
      const startIdx = scriptContent.indexOf(startString);
      const endIdx = scriptContent.indexOf(endString);
      let jsonStr = scriptContent.substring(startIdx + startString.length, endIdx);
      jsonStr = jsonStr.trim()
      return JSON.parse(jsonStr)
    }

    // elements from dataayer object
    const dataObj = findJsonObj('dataLayer', '=', ';')
    if (dataObj) {
      addElementToDocument('pd_harvested_list_price', dataObj[0].product.price.original);
      addElementToDocument('pd_price', dataObj[0].product.price.final);
      addElementToDocument('pd_brand', dataObj[0].product.brand);
      addElementToDocument('pd_price_currency', dataObj[0].product.currency);
      addElementToDocument('pd_gtin', dataObj[0].product.gtin);
      addElementToDocument('pd_id', dataObj[0].product.id);
    }
})
await context.extract(productDetails)
  },
};
