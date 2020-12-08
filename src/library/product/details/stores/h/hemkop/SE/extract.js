
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SE',
    store: 'hemkop',
    transform: null,
    domain: 'hemkop.de',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function getEleByXpath (xpath) {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        console.log('Element' + element);
        return element;
      }

      const prodDescriptionTabXpath = '//button[@ax-analytics2-action="ProductPage_ProductInfo_ProductFacts"]';
      const prodNutritionTabXpath = '//button[@ax-analytics2-action="ProductPage_ProductInfo_NutritionalValues"]';
      const prodDescButton = getEleByXpath(prodDescriptionTabXpath);
      const tabcontainer = getEleByXpath("//div[contains(@class, 'tabs-wrapper')]");
      if (prodDescButton) {
        // @ts-ignore
        prodDescButton.click();
        await new Promise((resolve, reject) => setTimeout(resolve, 3000));
        const prodDescContentTabXpath = "//div[contains(@class, 'tabs-wrapper')]//div[contains(@class, 'tabs-content')]";
        const prodDescTab = getEleByXpath(prodDescContentTabXpath);
        if (prodDescTab) {
          const body = document.querySelector('body');
          tabcontainer ? tabcontainer.appendChild(prodDescTab) : body.appendChild(prodDescTab);
        }
      }
      const prodNutritionButton = getEleByXpath(prodNutritionTabXpath);
      if (prodNutritionButton) {
        // @ts-ignore
        prodNutritionButton.click();
        await new Promise((resolve, reject) => setTimeout(resolve, 3000));
        const prodNutritionalContentTabXpath = "//div[contains(@class, 'tabs-wrapper')]//div[contains(@class, 'tabs-content')]";
        const prodNutriTab = getEleByXpath(prodNutritionalContentTabXpath);
        if (prodNutriTab) {
          const body = document.querySelector('body');
          tabcontainer ? tabcontainer.appendChild(prodNutriTab) : body.appendChild(prodNutriTab);
          tabcontainer.appendChild(prodNutriTab);
        }
      }
    });
    return await context.extract(productDetails, { transform: transformParam });
  },
};
