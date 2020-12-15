const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'origines',
    transform: cleanUp,
    domain: 'origines.fr',
    zipcode: '',
  },
  // @ts-ignore
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      function stall (ms) {
        // @ts-ignore
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      // Method to Retrieve Xpath content of a Single Node
      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };

      // Method to Retrieve Xpath content of a Multiple Nodes
      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };

      // added for product description
      const descriptionPath1 = getXpath("//meta[@property='og:title']/@content", 'nodeValue');
      const descriptionPath2 = getXpath("//div[@class='border-gallery']//h2[@class='second-label']/text()", 'nodeValue');
      console.log(descriptionPath1 + descriptionPath2);
      if ((descriptionPath1 !== null) && (descriptionPath2 !== null)) {
        var descriptionVal = descriptionPath1 + descriptionPath2;
        addElementToDocument('added_description', descriptionVal);
      }
      // added for price & currency
      const price = getXpath("//meta[@property='product:price:amount']/@content", 'nodeValue');
      const currency = getXpath("//meta[@property='product:price:currency']/@content", 'nodeValue');
      console.log('price>' + price);
      if ((price !== null) && (currency !== null)) {
        var priceVal = price.replace('.', ',');
        var pricecurrency = priceVal + ' ' + currency;
        addElementToDocument('added_pricecurrency', pricecurrency);
      }
      console.log(pricecurrency);
      // @ts-ignore
      const variantInformation = getAllXpath('//*[@id="addtocart_fake_form_size"]//*[@class="price_pos"]//div[@data-product-id]/@data-product-id', 'nodeValue');
      if (variantInformation != null) {
        addElementToDocument('added_variantInformation', variantInformation.join(' | '));
      }
      const skuNumber = getXpath("//script[contains(text(),'window.dataLayer.push')]/text()", 'nodeValue');
      // console.log(skuNumber);
      var sku = '';
      var id = '';
      if (typeof skuNumber !== 'undefined' && skuNumber !== '') {
        var skuNumberArr = skuNumber.split(',');
        // console.log(skuNumberArr);
        if (typeof skuNumberArr !== 'undefined' && skuNumberArr.length > 0) {
          // @ts-ignore
          let skuNumber = skuNumberArr[4];
          let idNumber = skuNumberArr[3];
          // @ts-ignore
          skuNumber = skuNumber.split(':');
          idNumber = idNumber.split(':');
          console.log(idNumber);
          sku = skuNumber[1];
          id = idNumber[2];
          id = (id !== undefined) ? id.replace(/[^a-zA-Z 0-9]+/g, '') : '';
          console.log(id);
        }
      }

      addElementToDocument('added_sku', sku);

      if (typeof variantInformation !== 'undefined' && variantInformation.length > 0) {
        // var variantInformationAll = '';
        var counter = 0;
        for (var informationKey in variantInformation) {
          console.log('variantInformation....' + variantInformation[informationKey]);
          // eslint-disable-next-line eqeqeq
          if (counter == 0) {
            addElementToDocument('added_variant_information', variantInformation[informationKey]);
          }
          counter++;
        }
      }

      addElementToDocument('added_product_id', id);

      const ingredients = getXpath("//div[@class='product attribute description']//div[@id='Ingredients']", 'innerText');
      console.log(ingredients);
      if (ingredients) {
        var ingredientsArr = ingredients.split(':');
        console.log(ingredientsArr);
        if (ingredientsArr) {
          console.log(ingredientsArr[1]);
          addElementToDocument('added_ingredients', ingredientsArr[1]);
        }
      }

      let scrollTop = 500;
      while (true) {
        window.scroll(0, scrollTop);
        await stall(1000);
        scrollTop += 500;
        if (scrollTop === 10000) {
          break;
        }
      };
    });
    return await context.extract(productDetails, { transform: transformParam });
  },
};
