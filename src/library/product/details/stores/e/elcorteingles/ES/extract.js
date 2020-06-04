
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles',
    transform: null,
    domain: 'elcorteingles.es',
  },
  // @ts-ignore
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      function findJsonData (scriptSelector, startString, endString) {
        const xpath = `//script[contains(.,'${scriptSelector}')]`;
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        // @ts-ignore
        const scriptContent = element.innerText;
        const startIdx = scriptContent.indexOf(startString);
        const endIdx = scriptContent.indexOf(endString);
        let jsonStr = scriptContent.substring(startIdx + startString.length, endIdx);
        jsonStr = jsonStr.trim();
        return JSON.parse(jsonStr);
      }

      function findJsonObj (scriptSelector) {
        const xpath = `//script[contains(.,'${scriptSelector}')]`;
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        // @ts-ignore
        let jsonStr = element.innerText;
        jsonStr = jsonStr.trim();
        return JSON.parse(jsonStr);
      }

      const imageData = findJsonObj('image');
      if (imageData) {
        addElementToDocument('product_image', `https:${imageData.image}`);
        addElementToDocument('product_description', imageData.description);
        addElementToDocument('sku', imageData.sku);
      }

      // elements from data Layer object
      const dataObj = findJsonData('dataLayer', '=', ';');
      if (dataObj) {
        if (dataObj[0].product.status.toLowerCase() === "available") {
          addElementToDocument('availability', "In Stock");
        } else {
          addElementToDocument('availability', "Out Of Stock");
        }
        addElementToDocument('brand', dataObj[0].product.brand);
        if (dataObj[0].product.id) {
          if (dataObj[0].product.id.match(/[0-9](.*)___/)) {
            let retailer_product_code = dataObj[0].product.id.match(/[0-9](.*)___/)[1];
            addElementToDocument('retailer_product_code', retailer_product_code);
          }
        }

      }

      // @ts-ignore
      const breadcrumb = [...document.querySelectorAll("li.breadcrumbs-item")]
      if(breadcrumb) {
        const subCategory = breadcrumb.map(i => i.innerText ).join('>');
        addElementToDocument('sub_category', subCategory);
      }
    });
    await context.extract(productDetails);
  },
};
