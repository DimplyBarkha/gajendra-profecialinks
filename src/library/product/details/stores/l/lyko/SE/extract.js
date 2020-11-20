
const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SE',
    store: 'lyko',
    transform: null,
    domain: 'lyko.com',
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
      const rawdata = document.querySelectorAll('script[type="application/ld+json"]')[0].innerText;
      const jsondata = JSON.parse(rawdata);
      const gtin = jsondata.gtin13;
      console.log(gtin,'gtin')
      const aggregateRating = jsondata.aggregateRating.ratingValue;
      addElementToDocument('gtin', gtin);
      // let singleRating;
      // var ratings = document.querySelectorAll("div[class='hide-when-purchase-disabled prices'] div[class='ratings']");
      // if (ratings.length > 0) {
      //   // @ts-ignore
      //   singleRating = ratings[0].style.width;
      // }
      // else {
      //   singleRating = '0';
      // }
      // singleRating = singleRating.slice(0, singleRating.length - 1)
      // singleRating = (5 * singleRating) / 100;
      // addElementToDocument('aggregateRating', singleRating);
      // // @ts-ignore
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
