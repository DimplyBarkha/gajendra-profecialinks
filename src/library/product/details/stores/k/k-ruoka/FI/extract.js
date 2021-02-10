
const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FI',
    store: 'k-ruoka',
    transform,
    domain: 'k-ruoka.fi',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {
      var NutritionInfo = document.querySelector('div.shopping-list-product-details-container section.collapsible-container.product-nutritional-detail a');
      var table = document.querySelector('div.nutritional-contents');
      if (table) {
        document.body.append(table);
      } else if (!table && NutritionInfo) {
        console.log('clicking...');
        NutritionInfo.click();
        var table = document.querySelector('div.nutritional-contents');
        document.body.append(table);
      }
      const sellerInfo = document.querySelector('div.shopping-list-product-details-container > section > section.collapsible-container.product-availability > a');
      if (sellerInfo) {
        sellerInfo.click();
      }
      //clicking the show more option in the description
      const descriptionText = document.querySelector('.product-details-description>a');
      if (descriptionText) {
        descriptionText.click();
      }
      //clicking the anchor to load more details
      const navButton = document.querySelector('section.collapsible-container.collapsible-basic-details img');
      if (navButton) {
        navButton.click();
        console.log('navButton clicked');
      }
      //clicking the anchor to load more stores
      const navButton1 = document.querySelector('.collapsible-container.product-availability img');
      if (navButton1) {
        navButton1.click();
        console.log('navButton1 clicked');
      }
      //clicking the anchor to load nutrition
      const navButton2 = document.querySelector('.collapsible-container.product-nutritional-detail img');
      if (navButton2) {
        navButton2.click();
        console.log('navButton2 clicked');
      }
      //clicking the anchor to load allergy advices
      const algButton = document.querySelector('.allergens__group a');
      if (algButton) {
        algButton.click();
        console.log('algbutton clicked');
      }
    });

    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
