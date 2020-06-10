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

        // @ts-ignore
        for (const div of rowDiv) {
          if (div.textContent.includes('Allergens')) {
            const allList = div.parentElement.parentElement.querySelectorAll('.c-expandable-list-block__item-value');
            for (const element of allList) {
              if (element.textContent.includes('CONTAINS')) {
                allergensList.push(element.parentElement.querySelector('.c-expandable-list-block__item-label').innerHTML);
              }
            }
          }
        }

        addHiddenDiv('allergens', allergensList.join(', '));
      }

      function addShippingInfo () {
        const shippingDivText = document.querySelector('span.c-product-shop-box__ship-info-description-shipping').textContent;
        const rowDiv = document.querySelectorAll('.c-expandable-list-block__caption-title');
        let shipText = '';
        // @ts-ignore
        for (const div of rowDiv) {
          if (div.textContent.includes('Properties')) {
            const allList = div.parentElement.parentElement.querySelectorAll('.c-expandable-list-block__item');
            for (const element of allList) {
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
        // @ts-ignore
        for (const div of rowDiv) {
          if (div.textContent.includes('Product Specifications')) {
            const allList = div.parentElement.parentElement.querySelectorAll('.c-expandable-list-block__item');
            for (const element of allList) {
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
          calories: 'caloriesPerServing',
          'calories from fat': 'caloriesFromFatPerServing',
          'total fat': 'totalFatPerServing',
          'total fat uom': 'totalFatPerServingUom',
          'saturated fat': 'saturatedFatPerServing',
          'saturated fat uom': 'saturatedFatPerServingUom',
          'trans fat': 'transFatPerServing',
          'trans fat uom': 'transFatPerServingUom',
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
          sodium: 'saltPerServing',
          'sodium uom': 'saltPerServingUom',
        };
        const rowDiv = document.querySelectorAll('.c-expandable-list-block__caption-title');
        // @ts-ignore
        for (const div of rowDiv) {
          if (div.textContent.includes('Nutrition Facts')) {
            const allList = div.parentElement.parentElement.querySelectorAll('.c-expandable-list-block__item');
            for (const element of allList) {
              const nurtiItem = (element.children[0].textContent).toLowerCase();
              if (nutriObj[nurtiItem]) {
                addHiddenDiv(nutriObj[nurtiItem], element.children[1].textContent);
              }
            }
          }
        }
      }

      function hasZoomFeature () {
        const content = document.querySelector('.c-product-viewer__image-wrapper');

        if (content.querySelector('div').hasAttribute('data-zoom')) {
          addHiddenDiv('imageZoomFeaturePresent', 'Yes');
        }
      }

      addAllergensList();
      nurtitionInfo();
      addShippingInfo();
      hasZoomFeature();
      quantity();
    });

    return await context.extract(productDetails, { transform: transformParam });
  },
};
