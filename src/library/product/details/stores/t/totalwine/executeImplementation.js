const implementation = async function (
  inputs,
  parameters,
  context,
  dependencies,
) {
  let { url, id } = inputs;
  const zipcode = inputs.zipcode || inputs.Postcode;
  let storeId = inputs.StoreId || inputs.storeId || inputs.StoreID;
  // const Postcode = inputs.Postcode;
  const { loadedSelector, noResultsXPath } = parameters;
  if (!url) {
    if (!id) {
      throw new Error('no id provided');
    }
    url = await dependencies.createUrl({ id });
  }
  async function getStoreId (zipcode) {
    const response = await fetch('https://www.totalwine.com/registry/', {
      headers: {
        accept: 'application/vnd.oc.unrendered+json',
        'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8,de;q=0.7,fi;q=0.6,sv;q=0.5,nb;q=0.4,ja;q=0.3,he;q=0.2,ro;q=0.1,pl;q=0.1,th;q=0.1,nl;q=0.1,pt;q=0.1',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'sec-ch-ua': '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
      },
      body: `components%5B0%5D%5Bname%5D=location-slideout-component&components%5B0%5D%5Bversion%5D=1.0.42&components%5B0%5D%5Bparameters%5D%5Btype%5D=GET_STORES&components%5B0%5D%5Bparameters%5D%5Bquery%5D=${zipcode}`,
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
    });
    const json = await response.text();
    return json.match(/storeNumber":"([^"]+)/)[1];
  }
  if (!storeId && zipcode) {
    await context.goto('https://www.totalwine.com/', { timeout: 60000, waitUntil: 'networkidle0', checkBlocked: false });
    storeId = await context.evaluate(getStoreId, zipcode);
  }
  if (storeId) {
    if (url.match(/[?&]s=\d+/)) {
      url = url.replace(/([?&]s=)\d+/, `$1${storeId}`);
    } else {
      const queryString = url.match(/^[^?]+\?(.+)/);
      url = url.match(/^[^?]+/)[0] + `?s=${storeId}` + ((queryString && queryString[1]) || '');
    }
  }
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
  const noResults = await context.evaluate(() => !!document.querySelector('title').innerText.includes('Not Found'));
  if (noResults) return false;
  // dont need setZipCode as we can use queryParams.
  // if (zipcode) {
  //   await dependencies.setZipCode({ url, zipcode });
  // }
  try {
    await context.waitForSelector('div[class*="productDetailContainer"] div[class*="productHeader"] h1[class*="productTitle"]', { timeout: 10000 });
    console.log('Header loaded successfully');
  } catch (error) {
    console.log('selector did not loaded' + error);
  }
  // const appendData = async () => {
  await context.evaluate((zipcode, storeId) => {
    console.log('zipcode value' + zipcode);
    const url = window.location.href;
    storeId = storeId || url.replace(/(.+)(s=)(\d+)(&)(.+)/g, '$3');
    console.log('storeid value' + storeId);
    const appendElement = document.querySelector('div[class*="productDetailContainer"] div[class*="productHeader"] h1[class*="productTitle"]');
    appendElement && appendElement.setAttribute('zipcodeinformation', zipcode);
    appendElement && appendElement.setAttribute('storeidinformation', storeId);
  }, zipcode, storeId);
  // }

  // appendData();

  // if (parameters.loadedSelector) {
  //   await context.waitForFunction(function (sel, xp) {
  //     return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
  //   }, { timeout: 20000 }, parameters.loadedSelector, parameters.noResultsXPath);
  // }

  async function getData (variantUrl) {
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
      const storeUniqueId = storeId || currentStoreId;
      await new Promise((resolve, reject) => setTimeout(resolve, 6000));
      const productDetails = await getData(`https://www.totalwine.com/product/api/product/product-detail/v1/getProduct/${sku}?shoppingMethod=INSTORE_PICKUP&state=US-CA&storeId=${currentStoreId || storeUniqueId}`);
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
