
const { transform } = require('./shared');
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'US',
    store: 'bestbuy',
    transform,
    domain: 'bestbuy.com',
    zipcode: '',
  },
  implementation,
};

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productReviews } = dependencies;

  await new Promise(resolve => setTimeout(resolve, 5000));
  try {
    await context.evaluate(async function () {
      const countrySelect = document.querySelector('div.country-selection > a.us-link');
      if (countrySelect) {
        // @ts-ignore
        countrySelect.click();
      }
    });
  } catch (e) {
    console.log('country not found');
  }

  await new Promise(resolve => setTimeout(resolve, 9000));
  try {
    var upc = await context.evaluate(async () => {
      const pattern = /gtin13":"([^"]+)/i;
      const removeZero = /0(.+)/i;
      // @ts-ignore
      const upcValue = document.evaluate("//script[contains(text(),'gtin13')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      const firstValue = upcValue.outerText.match(pattern)[1];
      return firstValue.match(removeZero)[1];
    });
  } catch (e) {
    console.log('upc not found');
  };

  try {
    await context.evaluate(async function () {
      const reviewAll = document.querySelector('a.see-all-reviews');
      if (reviewAll) {
        // @ts-ignore
        reviewAll.click();
      }
    });
  } catch (e) {
    console.log('review selector not found');
  };
  await new Promise(resolve => setTimeout(resolve, 9000));
  try {
    const reviewUrls = await context.evaluate(async function () {
      const reviewSort = document.querySelector('ul.reviews-list');
      if (reviewSort) {
        const reviewUrls = window.location.href;
        return reviewUrls;
      } else {
        return 'false';
      }
    });
    if (reviewUrls !== 'false') {
      await context.goto(`${reviewUrls}&sort=MOST_RECENT`);
    }
  } catch (e) {
    console.log('review selector not found');
  };
  await new Promise(resolve => setTimeout(resolve, 5000));
  try {
    var skuValue = await context.evaluate(async () => {
    // @ts-ignore
      return document.querySelector('div.sku span.product-data-value').innerText;
    });
  } catch (e) {
    console.log('sku selector not found');
  };

  try {
    var productUrl = await context.evaluate(async () => {
      const reviewSort = document.querySelector('div.syndicated-review-displaylink') && document.querySelector('div[id="no-review-yet"]');
      if (reviewSort) {
        return window.location.href;
      }
    });
  } catch (e) {
    console.log('product url not found');
  };

  try {
    var brandName = await context.evaluate(async () => {
      const reviewSort = document.querySelector('div.syndicated-review-displaylink');
      if (reviewSort) {
      // @ts-ignore
        return document.querySelector('a.btn-brand-link').innerText;
      }
    });
  } catch (e) {
    console.log('product url not found');
  };

  await context.waitForSelector('div.syndicated-review-displaylink')
    .catch(() => { });
  const newPage = async () => {
    return await context.evaluate(async function () {
      const newPageEl = document.evaluate(
        "//div[@id='no-review-yet']",
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null,
      );
      if (newPageEl.snapshotLength) {
        return 'true';
      } else {
        return 'false';
      }
    });
  };

  console.log('*************newPage', (await newPage()) === 'true');
  if ((await newPage()) === 'true') {
    // await context.clickAndWaitForNavigation("div.b_2TiXwODAcc a")
    // .catch(() => { });
    const specificationNavigate = await context.evaluate(async function () {
      // @ts-ignore
      return document.querySelector('div.syndicated-review-displaylink a').href;
    });

    console.log('specification_navigate', specificationNavigate);
    await context.goto(`${specificationNavigate}`, { timeout: 5000 });
    const reviewUrl = await context.evaluate(async function () {
      const reviewUrl = window.location.href;
      return reviewUrl;
    });
    await context.goto(`${reviewUrl}&sort=submissionTime`);
  }
  await new Promise(resolve => setTimeout(resolve, 5000));
  async function addUrl () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const url = window.location.href;
    addHiddenDiv('reviewUrl_value', url);
  }
  await context.evaluate(addUrl);

  await context.evaluate(async (skuValue, productUrl, brandName, upc) => {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    addHiddenDiv('skuValues', skuValue);
    addHiddenDiv('product-url', productUrl);
    addHiddenDiv('brand', brandName);
    addHiddenDiv('upcValue', upc);
  }, skuValue, productUrl, brandName, upc);

  console.log(skuValue, 'valuessss');
  return await context.extract(productReviews, { transform });
}
