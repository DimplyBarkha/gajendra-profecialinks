const { transform } = require('./shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async function () {
    const jsonString = JSON.parse(document.querySelector('script#__NEXT_DATA__').textContent).props.pageProps.initialState.product.composedItemView;
    const optionalWait = async (sel) => {
      try {
        await context.waitForSelector(sel, { timeout: 60000 });
      } catch (err) {
        console.log(`Couldn't load selector => ${sel}`);
      }
    };

    function getproductInfo () {
      const array = document.querySelectorAll('div[class*="ProductVariationsstyled__OptionsContainer"] select option');
      const varInfo = [...document.querySelectorAll('div[class*="ProductVariationsstyled__OptionsContainer"] select option')].map((ele) => ele.getAttribute('label'));
      for (let i = 0; i < Object.keys(jsonString).length; i++) {
        const images = [];
        array[i].setAttribute('name', jsonString[parseInt(Object.keys(jsonString)[i])].name);
        array[i].setAttribute('variantId', jsonString[parseInt(Object.keys(jsonString)[i])].id);
        array[i].setAttribute('sku', jsonString[parseInt(Object.keys(jsonString)[i])].id);
        array[i].setAttribute('price', jsonString[parseInt(Object.keys(jsonString)[i])].price.price_USD);
        array[i].setAttribute('listPrice', jsonString[parseInt(Object.keys(jsonString)[i])].price.listprice_USD);
        array[i].setAttribute('mainImage', jsonString[parseInt(Object.keys(jsonString)[i])].thumbnail);
        array[i].setAttribute('upcNumber', jsonString[parseInt(Object.keys(jsonString)[i])].upcNumber);
        array[i].setAttribute('size', varInfo[i]);
        array[i].setAttribute('directions', jsonString[parseInt(Object.keys(jsonString)[i])].directions.directions);
        array[i].setAttribute('warranty', jsonString[parseInt(Object.keys(jsonString)[i])].warranty.warranty);
        array[i].setAttribute('availability', jsonString[parseInt(Object.keys(jsonString)[i])].inventory.inventoryStatus);
        for (var j = 1; j < jsonString[parseInt(Object.keys(jsonString)[i])].pip.images.length; j++) {
          images.push(`https:${jsonString[parseInt(Object.keys(jsonString)[i])].pip.images[j].imgURL}`);
        }
        array[i].setAttribute('alternateImages', images);
        array[i].setAttribute('variantCount', Object.keys(jsonString).length);
        array[i].setAttribute('firstVariant', jsonString[parseInt(Object.keys(jsonString)[0])].sku);
        array[i].setAttribute('variants', Object.keys(jsonString));
        array[i].setAttribute('varInfo', varInfo);
      }
    }

    function optionTag() {
      var option = document.createElement('option');
      document.querySelector('div[class*="ProductVariationsstyled__OptionsContainer"] select').appendChild(option);
    }

    const isAvailable = document.querySelector('div[class*="ProductVariationsstyled__OptionsContainer"] select');
    if (isAvailable) {
      const length = document.querySelectorAll('div[class*="ProductVariationsstyled__OptionsContainer"] select option').length;
      if (length === Object.keys(jsonString).length) {
        optionalWait('main h1[class*="ProductNamestyled"]');
        getproductInfo();
      } else {
        optionalWait('main h1[class*="ProductNamestyled"]');
        getproductInfo();
      }
    } else {
      optionalWait('main h1[class*="ProductNamestyled"]');
      var newDiv = document.createElement('div');
      newDiv.className = 'ProductVariationsstyled__OptionsContainer';
      document.querySelector('fieldset[class*="SelectDeliveryMethodstyled"]').append(newDiv);
      var newSelect = document.createElement('select');
      document.querySelector('fieldset[class*="SelectDeliveryMethodstyled"] div[class*="ProductVariationsstyled__OptionsContainer"]').append(newSelect);
      var option = document.createElement('option');
      document.querySelector('fieldset[class*="SelectDeliveryMethodstyled"] div[class*="ProductVariationsstyled__OptionsContainer"] select').appendChild(option);
      getproductInfo();
    }
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'petco',
    transform,
    domain: 'petco.com',
    zipcode: '',
  },
  implementation,
};
