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
    await context.waitForSelector('div.c-expandable-list-block__caption-title');
    await context.evaluate(() => {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }

      function getEleByXpath (xpath) {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        console.log('Element' + element);
        return element;
      }

      function addAllergensList () {
        const allergenTab = getEleByXpath('//div[contains(@class, "p-product-detail__product-features-table")]// div[contains(@class, "c-tab-box__tab-links")][text()="Allergens"]');
        if (allergenTab) {
          allergenTab.click();
        }

        const allergensList = [];
        const rowDiv = document.querySelectorAll('.c-expandable-list-block__caption-title');
        for (let i = 0; i < rowDiv.length; i++) {
          const div = rowDiv[i];
          if (div.textContent && div.textContent.includes('Allergens')) {
            const allList = div.parentElement.parentElement.querySelectorAll('.c-expandable-list-block__item');
            for (let i = 0; i < allList.length; i++) {
              const element = allList[i];
              if (element.textContent.includes('Yes')) {
                allergensList.push(element.querySelector('div').textContent);
              } else if (element.textContent.includes('Allergens') && element.querySelectorAll('div') && element.querySelectorAll('div')[1]) {
                allergensList.push(element.querySelectorAll('div')[1].textContent);
              }
            }
            break;
          }
        }

        addHiddenDiv('allergens', allergensList.join(', '));
        const prodSpecTab = getEleByXpath('//div[contains(@class, "p-product-detail__product-features-table")]// div[contains(@class, "c-tab-box__tab-links")][text()="Product Specifications"]');
        prodSpecTab.click();
      }

      function nurtitionInfo () {
        const nutritionTab = getEleByXpath('//div[contains(@class, "p-product-detail__product-features-table")]//div[contains(@class, "c-tab-box__tab-links")][text()="Nutrition Facts"]');
        if (nutritionTab) {
          nutritionTab.click();
        }

        const nutriObj = {
          serving: 'servingSize',
          calories: 'caloriesPerServing',
          'calories from fat': 'caloriesFromFatPerServing',
          'total fat': 'totalFatPerServing',
          'saturated fat': 'saturatedFatPerServing',
          'trans fat': 'transFatPerServing',
          'transfatty acids': 'transFatPerServing',
          cholesterol: 'cholestrolPerServing',
          'total carbohydrates': 'totalCarbPerServing',
          'dietary fiber': 'dietaryFibrePerServing',
          sugars: 'totalSugarsPerServing',
          protein: 'proteinPerServing',
          'vitamin a': 'vitaminAPerServing',
          'vitamin c': 'vitaminCPerServing',
          calcium: 'calciumPerServing',
          iron: 'ironPerServing',
          magnesium: 'magnesiumPerServing',
          salt: 'saltPerServing',
          sodium: 'sodiumPerServing',
        };
        const rowDiv = document.querySelectorAll('.c-expandable-list-block__caption-title');
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
            }
            break;
          }
        }

        const prodSpecTab = getEleByXpath('//div[contains(@class, "p-product-detail__product-features-table")]// div[contains(@class, "c-tab-box__tab-links")][text()="Product Specifications"]');
        prodSpecTab.click();
      }

      addAllergensList();
      nurtitionInfo();
      addHiddenDiv('imageZoomFeaturePresent', document.querySelector('a.c-product-viewer__action-zoom') !== null ? 'Yes' : 'No');
    });

    return await context.extract(productDetails, { transform: transformParam });
  },
};
