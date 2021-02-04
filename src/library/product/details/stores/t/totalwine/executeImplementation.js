const implementation = async function (
  inputs,
  parameters,
  context,
  dependencies
) {
  let { url, id } = inputs;
  let zipcode = inputs.zipcode || inputs.Postcode;
  const storeId = inputs.StoreId;
  // const Postcode = inputs.Postcode;
  const { loadedSelector, noResultsXPath } = parameters;
  if (!url) {
    if (!id) {
      throw new Error('no id provided');
    }
    url = await dependencies.createUrl({ id });
  }
  // console.log('this is the value of storeid' + storeId);
  // console.log('this is the vlaue of postcode' + Postcode);
  // console.log('this is the value of zipcode' + zipcode)

  try {
    const response = await context.goto(url, { timeout: 60000, waitUntil: 'networkidle0', checkBlocked: false });
    console.log('Response ' + JSON.stringify(response));
    if (response.message && response.message.includes('code 403')) {
      console.log('Response failed');
      return context.reportBlocked(451, 'Blocked!');
    }
  } catch (err) {
    console.log('Error response' + JSON.stringify(err));
    if (err.message && err.message.includes('code 403')) {
      console.log('403 Response');
      return context.reportBlocked(451, 'Blocked!');
    }
    throw err;
  }
  // if (zipcode == undefined) {
  //   zipcode = Postcode;
  //   console.log('postcode value' + zipcode)
  // }
  if (zipcode) {
    await dependencies.setZipCode({ url, zipcode });
  }
  try {
    await context.waitForSelector('div[class*="productDetailContainer"] div[class*="productHeader"] h1[class*="productTitle"]', { timeout: 10000 })
    console.log('Header loaded successfully')
  } catch (error) {
    console.log('selector did not loaded' + error);
  }
  // const appendData = async () => {
  await context.evaluate((zipcode) => {
    console.log('zipcode value' + zipcode);
    const url = window.location.href;
    const storeId = url.replace(/(.+)(s=)(\d+)(&)(.+)/g, '$3');
    console.log('storeid value' + storeId);
    const appendElement = document.querySelector('div[class*="productDetailContainer"] div[class*="productHeader"] h1[class*="productTitle"]');
    appendElement && appendElement.setAttribute('zipcodeinformation', zipcode);
    appendElement && appendElement.setAttribute('storeidinformation', storeId);
  }, zipcode)
  // }

  // appendData();

  // if (parameters.loadedSelector) {
  //   await context.waitForFunction(function (sel, xp) {
  //     return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
  //   }, { timeout: 20000 }, parameters.loadedSelector, parameters.noResultsXPath);
  // }

  async function getData(variantUrl) {
    console.log('URL passed - ' + variantUrl);
    const data = await context.evaluate(async function (reqUrl) {
      const response = await fetch(reqUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.json();
    }, variantUrl);
    return data;
  };

  // Check if variants exists
  const variantsExist = await context.evaluate(function () {
    const variants = document.querySelectorAll('ul[role="listbox"][class*="reset"] > li');
    // return variants.length > 1;
    return !!variants;
  });

  const currentStoreId = await context.evaluate(function () {
    return document.querySelector('meta[itemprop="branchCode"]')
      ? document.querySelector('meta[itemprop="branchCode"]').getAttribute('content')
      : null;
  });

  if (!variantsExist) {
    return;
  }

  try {
    id = id || url && url.match(/\/p\/(\d+)/) && url.match(/\/p\/(\d+)/)[1];
    if (id) {
      // API call to fetch variants
      const sku = url && url.match(/\/p\/(\d+)/) && url.match(/\/p\/(\d+)/)[1];
      const storeUniqueId = zipcode === '95825' ? 1108 : url && url.match(/\/p\/(\d+)/) && url.match(/\/p\/(\d+)/)[1];
      await new Promise((resolve, reject) => setTimeout(resolve, 6000));
      const productDetails = await getData(`https://www.totalwine.com/product/api/product/product-detail/v1/getProduct/${sku}?shoppingMethod=INSTORE_PICKUP&state=US-CA&storeId=${currentStoreId ? currentStoreId : storeUniqueId}`);
      console.log('API call done');
      try {
        const variations = productDetails.skus.map(elm => elm.options.map(e => (`${e.type} - ${e.value}`)).join(', ')).join('|');
        await context.evaluate((text) => {
          document.body.setAttribute('variations', text);
        }, variations);
      } catch (err) {
        console.log('ERROR WHILE GETTING VARIANTS INFO', err);
      }
      await context.evaluate(async function (details) {
        // Add skus to DOM
        if (details.skus) {
          for (let i = 0; i < details.skus.length; i++) {
            const newDiv = document.createElement('div');
            console.log('sku id found ' + details.skuId);
            console.log('sku found ' + JSON.stringify(details.skus[i]));
            if (details.skuId === details.skus[i].skuId) {
              newDiv.setAttribute('class', 'currentItemId');
            } else {
              newDiv.setAttribute('class', 'itemId');
            }
            newDiv.textContent = details.skus[i].skuId;
            newDiv.style.display = 'none';
            document.body.appendChild(newDiv);
          }
        }
      }, productDetails);
    }
  } catch (err) {
    console.log('ERROR while calling the API' + err);
    throw err;
  }
  try {
    await context.waitForSelector('#avg-rating-button', { timeout: 10000 }).catch(err => { console.log('No rating found', err); });
    await context.hover('#avg-rating-button');
    await context.hover('h1[class^="productTitle"]');
  } catch (err) {
    console.log('cannot hover on rating');
  }
  if (loadedSelector) {
    await context.waitForFunction(
      (selector, xpath) => {
        return !!(document.querySelector(selector) || document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue);
      },
      { timeout: 10000 },
      loadedSelector,
      noResultsXPath,
    );
  }
  return await context.evaluate((xpath) => !document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue, noResultsXPath);
};

module.exports = { implementation };
