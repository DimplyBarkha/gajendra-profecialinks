const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'allbeauty',
    transform: cleanUp,
    domain: 'allbeauty.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      // @ts-ignore
      const rawdata = document.querySelectorAll('script[type="application/ld+json"]')[3].innerText;
      const jsondata = JSON.parse(rawdata);
      const gtin = jsondata.gtin13;
      addElementToDocument('gtin', gtin);

      const sku = jsondata.sku;
      addElementToDocument('sku', sku);

      const url = jsondata.url;
      addElementToDocument('url', url);

      const productID = jsondata.productID;
      addElementToDocument('id', productID);

      const brand = jsondata.brand;
      addElementToDocument('brand', brand);
      // @ts-ignore
      // const sku = window.dataLayer[1].product.sku;
      // addElementToDocument('sku', sku);
      // // @ts-ignore
      // const mpc = window.dataLayer[1].product_id;
      // addElementToDocument('mpc', mpc);
      // // @ts-ignore
      // const Brand = window.dataLayer[1].product.brand_name;
      // addElementToDocument('Brand', Brand);
      // // @ts-ignore
      // var fullText = document.querySelector('div[id="descriptionTabContent"] p').innerText;
      // fullText = fullText.replace(/\n\n/g, "_____");
      // const seperateText = fullText.split('_____');
      // var index;
      // for (index = 0; index < seperateText.length; index++) {
      //   if (seperateText[index].includes("Ingredients")) {
      //     addElementToDocument('ingredientsList', seperateText[index]);
      //     break;
      //   }
      // }
      // for (index = 0; index < seperateText.length; index++) {
      //   if (seperateText[index].includes("To use")) {
      //     addElementToDocument('directions', seperateText[index]);
      //     break;
      //   }
      // }
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};