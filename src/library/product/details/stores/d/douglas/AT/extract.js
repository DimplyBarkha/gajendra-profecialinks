// @ts-nocheck
const { cleanUp } = require('./transform');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const selectors = {
    sku: 'span.classification__item ~ span',
    target: '.product-detail-page',
  };
  try {
    await context.evaluate(async (selectors) => {
      const sku = document.querySelector(selectors.sku).innerText;
      if (sku) {
        const res = await fetch(`https://www.douglas.at/api/v2/products/${sku}`);
        const data = await res.json();
        if (data.price.formattedOriginalValue) {
          document.querySelector(selectors.target).setAttribute('list-price', data.price.formattedOriginalValue);
        }
        if (data.price.formattedValue) {
          document.querySelector(selectors.target).setAttribute('price', data.price.formattedValue);
        }
        if (data.availability) {
          let text = '';
          if (data.availability.code === 'AVAILABLE') {
            text = 'In Stock';
          } else {
            text = 'Out of Stock';
          }
          document.querySelector(selectors.target).setAttribute('availability', text);
        }
        // if (data.numberOfReviews) {
        //   document.querySelector(selectors.target).setAttribute('review-count', data.numberOfReviews);
        // }
        // if (data.averageRating) {
        //   let aggregateRating = data.averageRating.toString();
        //   aggregateRating = aggregateRating.replace('.', ',');
        //   document.querySelector(selectors.target).setAttribute('aggregate-rating', aggregateRating);
        // }
        if (data.ean) {
          document.querySelector(selectors.target).setAttribute('gtin', data.ean);
        }
        if (data.baseProduct) {
          document.querySelector(selectors.target).setAttribute('rpc', data.baseProduct);
        }
        if (data.name) {
          document.querySelector(selectors.target).setAttribute('variant-info', data.name);
        }
        if (data.url) {
          const url = 'https://www.douglas.at' + data.url;
          document.querySelector(selectors.target).setAttribute('product-url', url);
        }
        if (data.variantOptions) {
          let variantsCount;
          let variants = '';
          if (data.variantOptions.length === 1) {
            variantsCount = 0;
          } else {
            variantsCount = data.variantOptions.length;
            data.variantOptions.forEach(variant => {
              variants = variants + (variants ? ' | ' : '') + variant.code;
            });
            if (data.baseProduct) {
              document.querySelector(selectors.target).setAttribute('first-variant', data.baseProduct);
            }
          }
          document.querySelector(selectors.target).setAttribute('variants-count', variantsCount);
          document.querySelector(selectors.target).setAttribute('variants', variants);
        }
        document.querySelector(selectors.target).setAttribute('sku', sku);
      }
    }, selectors);
  } catch (e) {
    console.log(e.message);
  }

  await context.evaluate((selectors) => {
    const descDiv = document.evaluate(
      '//ul[@class="react-tabs__tab-list"]/li[contains(.,"details")]',
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    );
    if (descDiv.singleNodeValue) {
      descDiv.singleNodeValue.click();
      const desc = document.evaluate(
        '//div[contains(@class,"tab-panel--selected")]//div[contains(@class,"eyecatcher__container")] | //div[contains(@class,"tab-panel--selected")]//span[contains(@class,"classification__item")] | //div[contains(@class,"tab-panel--selected")]//div[contains(@class,"content__description")]',
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null,
      );
      let description = '';
      for (let i = 0; i < desc.snapshotLength; i++) {
        description = description + (description ? ' ' : '') + desc.snapshotItem(i).innerText;
      }
      description = description.replace(/\+\sMehr\sanzeigen/g, '');
      document.querySelector(selectors.target).setAttribute('description', description);
    }
  }, selectors);

  await context.evaluate((selectors) => {
    const directionsDiv = document.evaluate(
      '//ul[@class="react-tabs__tab-list"]/li[contains(.,"Anwendung")]',
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    );
    if (directionsDiv.singleNodeValue) {
      directionsDiv.singleNodeValue.click();
      const directions = document.querySelector('div[class*="tab-panel--selected"]').innerText;
      document.querySelector(selectors.target).setAttribute('directions', directions);
    }
  }, selectors);

  await context.evaluate((selectors) => {
    const ingDiv = document.evaluate(
      '//ul[@class="react-tabs__tab-list"]/li[contains(.,"Inhaltsstoffe")]',
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    );
    if (ingDiv.singleNodeValue) {
      ingDiv.singleNodeValue.click();
      const ingrediants = document.querySelector('div[class*="tab-panel--selected"]').innerText;
      document.querySelector(selectors.target).setAttribute('ingrediants', ingrediants);
    }
  }, selectors);

  // await context.evaluate(async () => {
  //   const isdirections = document.evaluate('//div[@class="truncate__html-container"][contains(.,"Anwendung:")]', document).iterateNext();
  //   if (isdirections) {
  //     const direction = isdirections.textContent.replace(/(.+)(Anwendung: ):?(.+)/g, '$3');
  //     document.querySelector('span.product-detail-header__name').setAttribute('directions', direction);
  //   }
  // });

  try {
    await context.waitForSelector('.bv-stars-container');
  } catch (e) {
    console.log('Reviews container is not present');
  }

  try {
    await context.evaluate((selectors) => {
      const updp = [...document.querySelectorAll('.product-recommendation-carousel a')];
      let text = '';
      const brandText = [];
      const nameExt = [];
      const type = [];
      const category = [];
      for (let i = 0; i < updp.length; i++) {
        const z = updp[i];
        const p = z.querySelector('div[class*="top-brand"]').innerText;
        const q = z.querySelector('div[class*="brand-line"]').innerText;
        const r = z.querySelector('div[class*="tile__name"]').innerText;
        const s = z.querySelector('div[class*="tile__category"]').innerText;
        brandText.push(p);
        nameExt.push(q);
        type.push(r);
        category.push(s);
        text += text ? ` || ${brandText[i]} ${nameExt[i]} ${type[i]} ${category[i]}` : `${brandText[i]} ${nameExt[i]} ${type[i]} ${category[i]}`;
      }
      document.querySelector(selectors.target).setAttribute('updp-info', text);
    }, selectors);
  } catch (e) {
    console.log(e.message);
  }
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: 'douglas',
    transform: cleanUp,
    domain: 'douglas.at',
    zipcode: '',
  },
  implementation,
};
