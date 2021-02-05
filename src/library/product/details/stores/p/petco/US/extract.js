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
        array[i].setAttribute('directions', jsonString[Object.keys(jsonString)[i]].directions.directions);
        array[i].setAttribute('warranty', jsonString[Object.keys(jsonString)[i]].warranty.warranty);
        for (var j = 1; j < jsonString[Object.keys(jsonString)[i]].pip.images.length; j++) {
          images.push(`https:${jsonString[Object.keys(jsonString)[i]].pip.images[j].imgURL}`);
        }
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

  try {
    await context.evaluate(() => {
      const desc = document.evaluate(
        '//div[contains(@class,"DescriptionContainer")]/div//p | //div[contains(@class,"DescriptionContainer")]/div//ul',
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null,
      );
      let text = '';
      let t = '';
      let z = '';
      for (let i = 0; i < desc.snapshotLength; i++) {
        const item = desc.snapshotItem(i);
        if (item.nodeName === 'STYLE') {
          item.remove();
        } else if (item.querySelector('button')) {
          item.querySelector('button').remove();
          z = item.innerText;
        } else if (item.nodeName === 'UL') {
          const lis = [...item.querySelectorAll('li')];
          lis.forEach(li => {
            t = t + (t ? ' || ' : '') + li.innerText;
          });
          z = ' || ' + t;
        } else {
          z = item.innerText;
        }
        text = text + (text ? ' ' : '') + z;
      }
      text = text.replace(/undefined/gs, '');
      document.body.setAttribute('additional-description', text);
    });
  } catch (e) {
    console.log(e.message);
  }

  try {
    await context.waitForXPath('//div[contains(@id,"inpage_container")]//img/@src', { timeout: 30000 });
  } catch (e) {
    console.log(e.message);
  }
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
