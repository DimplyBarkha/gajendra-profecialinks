const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'foodservicedirect',
    transform: cleanUp,
    domain: 'foodservicedirect.com',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(() => {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }

      function addAllergensList () {
        const allergensList = [];
        const rowDiv = document.querySelectorAll('.c-expandable-list-block__caption-title');
        for (let i = 0; i < rowDiv.length; i++) {
          const div = rowDiv[i];
          if (div.textContent && div.textContent.includes('Allergens')) {
            const allList = div.parentElement.parentElement.querySelectorAll('.c-expandable-list-block__item-value');
            for (let i = 0; i < allList.length; i++) {
              const element = allList[i];
              if (element.textContent.includes('CONTAINS')) {
                allergensList.push(element.parentElement.querySelector('.c-expandable-list-block__item-label').innerHTML);
              }
            }
          }
        }

        addHiddenDiv('allergens', allergensList.join(', '));
      }

      function addShippingInfo () {
        const shippingDiv = document.querySelector('span.c-product-shop-box__ship-info-description-shipping');
        let shippingDivText = '';
        if (shippingDiv) {
          shippingDivText = shippingDiv.textContent;
        } else {
          return;
        }
        const rowDiv = document.querySelectorAll('.c-expandable-list-block__caption-title');
        let shipText = '';
        for (let i = 0; i < rowDiv.length; i++) {
          const div = rowDiv[i];
          if (div.textContent.includes('Properties')) {
            const allList = div.parentElement.parentElement.querySelectorAll('.c-expandable-list-block__item');
            for (let i = 0; i < allList.length; i++) {
              const element = allList[i];
              if (element.textContent.includes('Shipping')) {
                shipText = element.textContent;
              }
            }
          }
        }

        const combinedShipping = [shippingDivText, shipText];

        addHiddenDiv('shippingInfo', combinedShipping.join(', '));
      }

      function quantity () {
        const rowDiv = document.querySelectorAll('.c-expandable-list-block__caption-title');
        let soldAsText = '';
        let unitQuantityText = '';
        for (let i = 0; i < rowDiv.length; i++) {
          const div = rowDiv[i];
          if (div.textContent.includes('Product Specifications')) {
            const allList = div.parentElement.parentElement.querySelectorAll('.c-expandable-list-block__item');
            for (let i = 0; i < allList.length; i++) {
              const element = allList[i];
              if (element.textContent.includes('Sold As')) {
                soldAsText = element.children[1].textContent;
              }
              if (element.textContent.includes('Unit Quantity')) {
                unitQuantityText = element.children[1].textContent;
                break;
              }
            }
          }
          break;
        }

        addHiddenDiv('quantityInfo', unitQuantityText + ' ' + soldAsText);
      }

      function nurtitionInfo () {
        const nutriObj = {
          serving: 'servingSize',
          'serving size uom': 'servingSizeUom',
          calories: 'caloriesPerServing',
          'calories from fat': 'caloriesFromFatPerServing',
          'total fat': 'totalFatPerServing',
          'total fat uom': 'totalFatPerServingUom',
          'saturated fat': 'saturatedFatPerServing',
          'saturated fat uom': 'saturatedFatPerServingUom',
          'trans fat': 'transFatPerServing',
          'trans fat uom': 'transFatPerServingUom',
          'transfatty acids': 'transFatPerServing',
          'transfatty acids uom': 'transFatPerServingUom',
          cholesterol: 'cholestrolPerServing',
          'cholesterol uom': 'cholestrolPerServingUom',
          'total carbohydrates': 'totalCarbPerServing',
          'total carbohydrates uom': 'totalCarbPerServingUom',
          'dietary fiber': 'dietaryFibrePerServing',
          'dietary fiber uom': 'dietaryFibrePerServingUom',
          sugars: 'totalSugarsPerServing',
          'sugars uom': 'totalSugarsPerServingUom',
          protein: 'proteinPerServing',
          'protein uom': 'proteinPerServingUom',
          'vitamin a': 'vitaminAPerServing',
          'vitamin a uom': 'vitaminAPerServingPerServingUom',
          'vitamin c': 'vitaminCPerServing',
          'vitamin c uom': 'vitaminCPerServingPerServingUom',
          calcium: 'calciumPerServing',
          'calcium uom': 'calciumPerServingUom',
          iron: 'ironPerServing',
          'iron uom': 'ironPerServingUom',
          magnesium: 'magnesiumPerServing',
          'magnesium uom': 'magnesiumPerServingUom',
          salt: 'saltPerServing',
          'salt uom': 'saltPerServingUom',
          sodium: 'sodiumPerServing',
          'sodium uom': 'sodiumPerServingUom',
        };
        const rowDiv = document.querySelectorAll('.c-expandable-list-block__caption-title');
        let servingSizeExist = false;
        let servingSizeText = '';
        for (let i = 0; i < rowDiv.length; i++) {
          const div = rowDiv[i];
          if (div.textContent.includes('Nutrition Facts')) {
            const allList = div.parentElement.parentElement.querySelectorAll('.c-expandable-list-block__item');
            for (let i = 0; i < allList.length; i++) {
              const element = allList[i];
              const nurtiItem = (element.children[0] && element.children[0].textContent) ? (element.children[0].textContent).toLowerCase() : '';
              if (nurtiItem.length && nutriObj[nurtiItem]) {
                addHiddenDiv(nutriObj[nurtiItem], element.children[1].textContent);
              }
              if (nurtiItem === 'serving size uom') {
                servingSizeExist = true;
              }
              if (nurtiItem === 'serving') {
                servingSizeText = element.children[1].textContent;
              }
            }
          }
        }

        if (!servingSizeExist && servingSizeText.length) {
          const re = /[a-zA-Z]+$/;
          const regPhrase = /[a-zA-Z\s]+/;
          if (servingSizeText.match(re) && servingSizeText.match(re)[0]) {
            servingSizeText = servingSizeText.match(re)[0];
          } else if (servingSizeText.match(regPhrase) && servingSizeText.match(regPhrase)[0]) {
            servingSizeText = servingSizeText.match(regPhrase)[0];
          } else {
            servingSizeText = '';
          }
          addHiddenDiv('servingSizeUom', servingSizeText);
        }
      }

      addAllergensList();
      nurtitionInfo();
      quantity();
      addShippingInfo();
    });

    return await context.extract(productDetails, { transform: transformParam });
  },
};
