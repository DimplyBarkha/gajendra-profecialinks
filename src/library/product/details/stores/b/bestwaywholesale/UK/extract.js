const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'bestwaywholesale',
    transform,
    domain: 'bestwaywholesale.co.uk',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      const productData = findProductDetails();

      addEleToDoc('productId', productData.id);
      addEleToDoc('productName', productData.name);

      // Normalizing & Adding nutritional info to DOM
      addNutritionalEle('saltPerServing', '/html/body//table//th[contains(text(), \'Salt\')]/following-sibling::td[1]', 'saltPerServingUom');
      addNutritionalEle('servingSize', '//h2[contains(.,"Nutritional Information")]/following-sibling::table//tr[1]/th[2]', 'servingSizeUom');

      const multiNutriObj = {
        totalFatPerServing: 'Fat',
        saturatedFatPerServing: 'saturates',
        totalCarbPerServing: 'Carbohydrate',
        dietaryFibrePerServing: 'Fibre',
        totalSugarsPerServing: 'sugars',
        proteinPerServing: 'Protein',
        calciumPerServing: 'Calcium',
        vitaminCPerServing: 'Vitamin C',
      };

      addMultipleNutritionalEle(multiNutriObj);

      // Add availability to the DOM
      const available = getEleByXpath('//div/p[contains(@class,"prodstock") or contains(.,\'available\')]');
      if (available) {
        if (available.includes('In stock')) {
          addEleToDoc('availabilityText', 'In Stock');
        } else {
          addEleToDoc('availabilityText', 'Out of Stock');
        }
      }

      function getEleByXpath (xpath) {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        console.log('Element' + element);
        const text = element ? element.textContent : null;
        return text;
      }

      function addNutritionalEle (property, xpath, propertyUom) {
        const servingProp = getEleByXpath(xpath);
        if (servingProp) {
          addEleToDoc(property, servingProp.replace('mg', '').replace('g', '').replace('ml', '').replace('Per', '').replace(':', '').split('(')[0].trim());
          if (servingProp.includes('mg')) {
            addEleToDoc(propertyUom, 'mg');
          } else if (servingProp.includes('g')) {
            addEleToDoc(propertyUom, 'g');
          } else if (servingProp.includes('ml')) {
            addEleToDoc(propertyUom, 'ml');
          }
        }
      }

      function addMultipleNutritionalEle (propertiesObj) {
        for (const prop in propertiesObj) {
          const xpath = `//th[contains(.,'${propertiesObj[prop]}')]/following-sibling::td[1]`;
          addNutritionalEle(`${prop}`, xpath, `${prop}Uom`);
        }
      }

      function findProductDetails () {
        const xpath = '//script[contains(.,\'productDetails\')]';
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        console.log('Element' + element);
        const scriptContent = element.textContent;
        let scriptContentArr = scriptContent.split(';');
        scriptContentArr = scriptContentArr.filter(function (item) { if (item.includes('productsObject.')) return item; });
        const productDetails = {};
        for (let i = 0; i < scriptContentArr.length; i++) {
          const chunk = scriptContentArr[i];
          const productProp = chunk.substring(chunk.indexOf('productsObject.') + 'productsObject.'.length, chunk.indexOf(' ='));
          const productPropVal = chunk.substring(chunk.indexOf(`productsObject.${productProp} = "`) + `productsObject.${productProp} = "`.length, chunk.lastIndexOf('"'));
          productDetails[productProp] = productPropVal;
        }
        return productDetails;
      }

      function addEleToDoc (key, value) {
        const prodEle = document.createElement('div');
        prodEle.id = key;
        prodEle.textContent = value;
        prodEle.style.display = 'none';
        document.body.appendChild(prodEle);
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
