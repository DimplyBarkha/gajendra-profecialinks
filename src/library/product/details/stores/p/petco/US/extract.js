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
    // const varInfo = [...document.querySelectorAll('div[class*="ProductVariationsstyled__OptionsContainer"] div[class*="floats__FloatContainer"]:nth-last-child(1) select option')].map((ele) => ele.getAttribute('label'));
    const varInfo = [];
    function getElementsByXPath (xpath) {
      const query = document.evaluate(xpath, document,
        null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      for (let i = 0, length = query.snapshotLength; i < length; ++i) {
        varInfo.push(query.snapshotItem(i).textContent);
      }
      return varInfo;
    }
    getElementsByXPath('//div[contains(@class,"ProductVariationsstyled__OptionsContainer")]//div[contains(@class,"floats__FloatContainer")]//label[contains(.,"weight") or contains(.,"Weight")]/following-sibling::div//select//option');

    function getproductInfo () {
      const array = document.querySelectorAll('div[class*="ProductVariationsstyled__OptionsContainer"] div[class*="floats__FloatContainer"]:nth-last-child(1) select option');
      for (let i = 0; i < Object.keys(jsonString).length; i++) {
        const images = [];
        array[i].setAttribute('name', jsonString[Object.keys(jsonString)[i]].name);
        array[i].setAttribute('variantId', jsonString[Object.keys(jsonString)[i]].id);
        array[i].setAttribute('sku', jsonString[Object.keys(jsonString)[i]].sku);
        array[i].setAttribute('price', jsonString[Object.keys(jsonString)[i]].price.price_USD);
        array[i].setAttribute('listPrice', jsonString[Object.keys(jsonString)[i]].price.listprice_USD);
        array[i].setAttribute('mainImage', jsonString[Object.keys(jsonString)[i]].thumbnail);
        array[i].setAttribute('upcNumber', jsonString[Object.keys(jsonString)[i]].upcNumber);
        array[i].setAttribute('size', varInfo[i]);
        array[i].setAttribute('directions', jsonString[Object.keys(jsonString)[i]].directions.directions);
        array[i].setAttribute('warranty', jsonString[Object.keys(jsonString)[i]].warranty.warranty);
        array[i].setAttribute('availability', jsonString[Object.keys(jsonString)[i]].inventory.inventoryStatus);
        for (var j = 1; j < jsonString[Object.keys(jsonString)[i]].pip.images.length; j++) {
          images.push(`https:${jsonString[Object.keys(jsonString)[i]].pip.images[j].imgURL}`);
        }
        array[i].setAttribute('alternateImages', images);
        array[i].setAttribute('variantCount', Object.keys(jsonString).length);
        array[i].setAttribute('firstVariant', jsonString[Object.keys(jsonString)[0]].sku);
        array[i].setAttribute('variants', Object.keys(jsonString));
        array[i].setAttribute('varInfo', varInfo);
      }
    }

    function optionTag () {
      var option = document.createElement('option');
      document.querySelector('div[class*="ProductVariationsstyled__OptionsContainer"] div[class*="floats__FloatContainer"]:nth-last-child(1) select').appendChild(option);
    }

    const isAvailable = document.querySelector('div[class*="ProductVariationsstyled__OptionsContainer"] div[class*="floats__FloatContainer"]:nth-last-child(1) select');
    if (isAvailable) {
      const length = document.querySelectorAll('div[class*="ProductVariationsstyled__OptionsContainer"] div[class*="floats__FloatContainer"]:nth-last-child(1) select option').length;
      if (length === Object.keys(jsonString).length) {
        optionalWait('main h1[class*="ProductNamestyled"]');
        getproductInfo();
      } else {
        optionalWait('main h1[class*="ProductNamestyled"]');
        optionTag();
        getproductInfo();
        document.querySelector('div[class*="ProductVariationsstyled__OptionsContainer"] div[class*="floats__FloatContainer"]:nth-last-child(1) select option:nth-last-child(1)').setAttribute('size', varInfo[1] ? varInfo[1] : varInfo[0]);
      }
    } else {
      optionalWait('main h1[class*="ProductNamestyled"]');
      var newDiv = document.createElement('div');
      newDiv.className = 'ProductVariationsstyled__OptionsContainer';
      document.querySelector('fieldset[class*="SelectDeliveryMethodstyled"]').append(newDiv);
      var newDiv1 = document.createElement('div');
      newDiv1.className = 'floats__FloatContainer';
      document.querySelector('fieldset[class*="SelectDeliveryMethodstyled"] div[class*="ProductVariationsstyled__OptionsContainer"]').append(newDiv1);
      var newSelect = document.createElement('select');
      document.querySelector('fieldset[class*="SelectDeliveryMethodstyled"] div[class*="ProductVariationsstyled__OptionsContainer"] div[class*="floats__FloatContainer"]').append(newSelect);
      var option = document.createElement('option');
      document.querySelector('fieldset[class*="SelectDeliveryMethodstyled"] div[class*="ProductVariationsstyled__OptionsContainer"] div[class*="floats__FloatContainer"] select').appendChild(option);
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
