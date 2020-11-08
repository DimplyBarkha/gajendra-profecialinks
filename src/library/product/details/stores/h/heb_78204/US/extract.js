const { transform } = require('../format.js');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  var descrLength = await context.evaluate(async () => {
    return (document.querySelectorAll('div.pdp-container.pdp-desktop-layout div.pdp-product-desc_text.pdp-step_title p')) ? document.querySelectorAll('div.pdp-container.pdp-desktop-layout div.pdp-product-desc_text.pdp-step_title p').length : 0;
  });
  var tableDataCount = await context.evaluate(async () => {
    return (document.querySelectorAll('div.pdp-container.pdp-desktop-layout table.details-xtd tr td')) ? document.querySelectorAll('div.pdp-container.pdp-desktop-layout table.details-xtd tr td').length : 0;
  });
  await preparePage(0, descrLength, tableDataCount, true);
  async function preparePage (index, descrLength, tableDataCount) {
    await context.evaluate(async (index, descrLength, tableDataCount) => {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      async function infiniteScroll () {
        let prevScroll = document.documentElement.scrollTop;
        while (true) {
          window.scrollBy(0, document.documentElement.clientHeight);
          await new Promise(resolve => setTimeout(resolve, 1000));
          const currentScroll = document.documentElement.scrollTop;
          if (currentScroll === prevScroll) {
            break;
          }
          prevScroll = currentScroll;
        }
      }
      await infiniteScroll();
      function getSingleText (xpath, document) {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        if (element && element.singleNodeValue) {
          const nodeElement = element.singleNodeValue;
          return nodeElement && nodeElement.textContent.trim().length > 1 ? nodeElement.textContent : '';
        } else {
          return '';
        }
      }
      if (descrLength === 3) {
        const descriptionXpath = '(//div[@class="pdp-container pdp-desktop-layout"]//div[@class="pdp-product-desc_text pdp-step_title"]//p)[1]';
        addHiddenDiv('description_text', getSingleText(descriptionXpath, document));
        const directionsXpath = '(//div[@class="pdp-container pdp-desktop-layout"]//div[@class="pdp-product-desc_text pdp-step_title"]//p)[2]';
        addHiddenDiv('directions_text', getSingleText(directionsXpath, document));
        const ingredientsListXpath = '(//div[@class="pdp-container pdp-desktop-layout"]//div[@class="pdp-product-desc_text pdp-step_title"]//p)[3]';
        addHiddenDiv('ingredientsList_text', getSingleText(ingredientsListXpath, document));
      } else if (descrLength === 2) {
        const descriptionXpath = '(//div[@class="pdp-container pdp-desktop-layout"]//div[@class="pdp-product-desc_text pdp-step_title"]//p)[1]';
        addHiddenDiv('description_text', getSingleText(descriptionXpath, document));
        const ingredientsListXpath = '(//div[@class="pdp-container pdp-desktop-layout"]//div[@class="pdp-product-desc_text pdp-step_title"]//p)[2]';
        addHiddenDiv('ingredientsList_text', getSingleText(ingredientsListXpath, document));
      } else if (descrLength === 1) {
        const descriptionXpath = '(//div[@class="pdp-container pdp-desktop-layout"]//div[@class="pdp-product-desc_text pdp-step_title"]//p)[1]';
        addHiddenDiv('description_text', getSingleText(descriptionXpath, document));
      }

      const initialCheck = getSingleText('(//tr[contains(translate(string(), "Total Fat", "Total Fat"), "Total Fat")]//td)[1]', document).trim().replace(/\s+/g, ' ').split(' ');

      if (initialCheck.length === 2) {
        const totalFatPerServingXpath = '(//tr[contains(translate(string(), "Total Fat", "Total Fat"), "Total Fat")]//td[2])[1]';
        addHiddenDiv('totalFatPerServing_text', getSingleText(totalFatPerServingXpath, document));
        const saturatedFatPerServingXpath = '(//tr[contains(translate(string(), "Saturated Fat", "Saturated Fat"), "Saturated Fat")]//td[2])[1]';
        addHiddenDiv('saturatedFatPerServing_text', getSingleText(saturatedFatPerServingXpath, document));
        const transFatPerServingXpath = '(//tr[contains(translate(string(), "Trans Fat", "Trans Fat"), "Trans Fat")]//td[2])[1]';
        addHiddenDiv('transFatPerServing_text', getSingleText(transFatPerServingXpath, document));
        const cholesterolPerServingXpath = '(//tr[contains(translate(string(), "Cholesterol", "Cholesterol"), "Cholesterol")]//td[2])[1]';
        addHiddenDiv('cholesterolPerServing_text', getSingleText(cholesterolPerServingXpath, document));
        const sodiumPerServingXpath = '(//tr[contains(translate(string(), "Sodium", "Sodium"), "Sodium")]//td[2])[1]';
        addHiddenDiv('sodiumPerServing_text', getSingleText(sodiumPerServingXpath, document));
        const totalCarbPerServingXpath = '(//tr[contains(translate(string(), "Total Carbohydrate", "Total Carbohydrate"), "Total Carbohydrate")]//td[2])[1]';
        addHiddenDiv('totalCarbPerServing_text', getSingleText(totalCarbPerServingXpath, document));
        const dietaryFibrePerServingXpath = '(//tr[contains(translate(string(), "Dietary Fiber", "Dietary Fiber"), "Dietary Fiber")]//td[2])[1]';
        addHiddenDiv('dietaryFibrePerServing_text', getSingleText(dietaryFibrePerServingXpath, document));
        const totalSugarsPerServingXpath = '(//tr[contains(translate(string(), "Sugars", "Sugars"), "Sugars")]//td[2])[1]';
        addHiddenDiv('totalSugarsPerServing_text', getSingleText(totalSugarsPerServingXpath, document));
        const proteinPerServingXpath = '(//tr[contains(translate(string(), "Protein", "Protein"), "Protein")]//td[2])[1]';
        addHiddenDiv('proteinPerServing_text', getSingleText(proteinPerServingXpath, document));
      } else if (initialCheck.length === 3) {
        const totalFatPerServing = getSingleText('(//tr[contains(translate(string(), "Total Fat", "Total Fat"), "Total Fat")]//td)[1]', document).trim().replace(/\s+/g, ' ').split(' ');
        addHiddenDiv('totalFatPerServing_text', totalFatPerServing[2]);
        const saturatedFatPerServing = getSingleText('(//tr[contains(translate(string(), "Saturated Fat", "Saturated Fat"), "Saturated Fat")]//td)[1]', document).trim().replace(/\s+/g, ' ').split(' ');
        addHiddenDiv('saturatedFatPerServing_text', saturatedFatPerServing[2]);
        const transFatPerServing = getSingleText('(//tr[contains(translate(string(), "Trans Fat", "Trans Fat"), "Trans Fat")]//td)[1]', document).trim().replace(/\s+/g, ' ').split(' ');
        addHiddenDiv('transFatPerServing_text', transFatPerServing[2]);
        const cholesterolPerServing = getSingleText('(//tr[contains(translate(string(), "Cholesterol", "Cholesterol"), "Cholesterol")]//td)[1]', document).trim().replace(/\s+/g, ' ').split(' ');
        addHiddenDiv('cholesterolPerServing_text', cholesterolPerServing[1]);
        const sodiumPerServing = getSingleText('(//tr[contains(translate(string(), "Sodium", "Sodium"), "Sodium")]//td)[1]', document).trim().replace(/\s+/g, ' ').split(' ');
        addHiddenDiv('sodiumPerServing_text', sodiumPerServing[1]);
        const totalCarbPerServing = getSingleText('(//tr[contains(translate(string(), "Total Carbohydrate", "Total Carbohydrate"), "Total Carbohydrate")]//td)[1]', document).trim().replace(/\s+/g, ' ').split(' ');
        addHiddenDiv('totalCarbPerServing_text', totalCarbPerServing[2]);
        const dietaryFibrePerServing = getSingleText('(//tr[contains(translate(string(), "Dietary Fiber", "Dietary Fiber"), "Dietary Fiber")]//td)[1]', document).trim().replace(/\s+/g, ' ').split(' ');
        addHiddenDiv('dietaryFibrePerServing_text', dietaryFibrePerServing[2]);
        const totalSugarsPerServing = getSingleText('(//tr[contains(translate(string(), "Sugars", "Sugars"), "Sugars")]//td)[1]', document).trim().replace(/\s+/g, ' ').split(' ');
        addHiddenDiv('totalSugarsPerServing_text', totalSugarsPerServing[2]);
        const proteinPerServing = getSingleText('(//tr[contains(translate(string(), "Protein", "Protein"), "Protein")]//td)[1]', document).trim().replace(/\s+/g, ' ').split(' ');
        addHiddenDiv('proteinPerServing_text', proteinPerServing[1]);
      }
    }, index, descrLength, tableDataCount);
  }
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'heb_78204',
    transform: transform,
    domain: 'heb.com',
    zipcode: '78204',
  },
  implementation,
};
