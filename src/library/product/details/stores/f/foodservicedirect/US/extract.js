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

      function addAllergensList () {
        const tabsNav = document.querySelectorAll('div.p-product-detail__product-features-table div.c-tab-box__tab-links');
        for (let i = 0; i < tabsNav.length; i++) {
          if (tabsNav[i].textContent.includes('Allergens')) {
            tabsNav[i].click();
          }
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
          }
        }

        addHiddenDiv('allergens', allergensList.join(', '));

        if (tabsNav[0].textContent.includes('Product Specifications')) {
          tabsNav[0].click();
        }
      }

      function addShippingInfo () {
        const rowDiv = document.querySelectorAll('.c-expandable-list-block__caption-title');
        let shipText = '';
        for (let i = 0; i < rowDiv.length; i++) {
          const div = rowDiv[i];
          if (div.textContent.includes('Properties')) {
            const allList = div.parentElement.parentElement.querySelectorAll('.c-expandable-list-block__item');
            for (let i = 0; i < allList.length; i++) {
              const element = allList[i];
              if (element.textContent.includes('Shipping Type')) {
                shipText = element.lastChild.textContent;
              }
            }
          }
        }

        addHiddenDiv('shippingInfo', shipText);
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
        const tabsNav = document.querySelectorAll('div.p-product-detail__product-features-table div.c-tab-box__tab-links');
        for (let i = 0; i < tabsNav.length; i++) {
          if (tabsNav[i].textContent.includes('Nutrition Facts')) {
            tabsNav[i].click();
          }
        }
        const nutriObj = {
          serving: 'servingSize',
          // 'serving size uom': 'servingSizeUom',
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
        // let servingSizeExist = false;
        // let servingSizeText = '';
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
              // if (nurtiItem === 'serving size uom') {
              //   servingSizeExist = true;
              // }
              // if (nurtiItem === 'serving') {
              //   servingSizeText = element.children[1].textContent;
              // }
            }
          }
        }

        // if (!servingSizeExist && servingSizeText.length) {
        //   const re = /[a-zA-Z]+$/;
        //   const regPhrase = /[a-zA-Z\s]+/;
        //   if (servingSizeText.match(re) && servingSizeText.match(re)[0]) {
        //     servingSizeText = servingSizeText.match(re)[0];
        //   } else if (servingSizeText.match(regPhrase) && servingSizeText.match(regPhrase)[0]) {
        //     servingSizeText = servingSizeText.match(regPhrase)[0];
        //   } else {
        //     servingSizeText = '';
        //   }
        //   addHiddenDiv('servingSizeUom', servingSizeText);
        // }
        if (tabsNav[0].textContent.includes('Product Specifications')) {
          tabsNav[0].click();
        }
      }

      addAllergensList();
      nurtitionInfo();
      quantity();
      addShippingInfo();
      addHiddenDiv('imageZoomFeaturePresent', document.querySelector('a.c-product-viewer__action-zoom') !== null ? 'Yes' : 'No');
    });

    return await context.extract(productDetails, { transform: transformParam });
  },
};
