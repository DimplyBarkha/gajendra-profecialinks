const { transform } = require('./shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  try {
    await context.waitForXPath('//div[contains(@id,"inpage_container")]//img', { timeout: 60000 });
    await context.evaluate(() => {
      const images = [...document.querySelectorAll('div[id*="inpage_container"] img:not([class*="flix-lingimg"])')];
      let img = '';
      images.forEach(item => {
        let src = item.getAttribute('data-srcset');
        if (!src) {
          src = item.getAttribute('src');
        }
        const temp = src.includes('https:') ? src : 'https:' + src;
        img = img + (img ? ' | ' : '') + temp;
      });
      document.body.setAttribute('manu-images', img);
    });
  } catch (e) {
    try {
      console.log("************CATCH BLOCK**************")
      const iframeSrc = 'iframe[id*="ec-iframe"]';
      await context.waitForSelector(iframeSrc, { timeout: 30000 });
      const linkObj = await context.evaluate((src) => {
        const currentLink = window.location.href;
        const iframeSrc = document.querySelector(src).getAttribute('src');
        const linkObj = {
          iframe: iframeSrc,
          current: currentLink,
        };
        return linkObj;
      }, iframeSrc);
      await context.goto(linkObj.iframe);
      await context.waitForSelector('div[data-role="module"] img', { timeout: 30000 });
      const manuImages = await context.evaluate(() => {
        const allImages = [...document.querySelectorAll('div[data-role="module"] img')];
        const img = [];
        allImages.forEach(item => {
          img.push(item.getAttribute('src'));
        });
        const images = [...new Set(img)];
        const temp = images.join(' | ');
        return temp;
      });
      const manuDesc = await context.evaluate(() => {
        const desc = document.evaluate(
          '//div[@data-role="module"]//h1 | //div[@data-role="module"]//h3 | //div[@data-role="module"]//p | //div[@data-role="module"]//span | //table//*[@data-role="chart-product-name"] | //table//*[@data-role="chart-feature-name"] | //table//tbody//th[contains(@class,"feature-header")] | //table//*[@data-role="data-cell-content"] | //div[contains(@class, "inpage_selector_feature")]|//h2[@data-role="header"]|//div[@id="flix-container"]|//div[contains(@class,"flix-text-center")]|//div[contains(@class,"flix-mobile-hide")]|//div[@data-role="comparison-chart"] |//div[@id="flix-container"]|//div[contains(@class,"flix-p")]',
          document,
          null,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
          null,
        );
        let text = '';
        for (let i = 0; i < desc.snapshotLength; i++) {
          const item = desc.snapshotItem(i);
          text = text + (text ? ' ' : '') + item.innerText;
        }
        return text;
      });
      await context.goto(linkObj.current);
      await context.evaluate((linkObj) => {
        document.body.setAttribute('product-url', linkObj.current);
      }, linkObj);
      const manuObj = {
        description: manuDesc,
        images: manuImages,
      };
      await context.evaluate((obj) => {
        document.body.setAttribute('manu-images', obj.images);
        document.body.setAttribute('manu-desc', obj.description);
      }, manuObj);
    } catch (e) {
      console.log(e.message);
    }
  }

  try {
    await context.waitForSelector('div[class*="DescriptionContainer"]', { timeout: 30000 });
    await context.evaluate(() => {
      const desc = document.evaluate(
        '//div[contains(@class,"DescriptionContainer")]/div//p[not(contains(@class,"DetailsTab___StyledP"))]|//div[contains(@class,"DescriptionContainer")]/div//ul',
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
