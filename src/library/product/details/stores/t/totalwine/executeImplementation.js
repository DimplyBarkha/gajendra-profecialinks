const implementation = async function (
  inputs,
  parameters,
  context,
  dependencies,
) {
  let { url, id } = inputs;

  const zipcode = inputs.zipcode || parameters.zipcode;
  if (!url) {
    if (!id) {
      throw new Error('no id provided');
    }
    url = await dependencies.createUrl({ id });
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

  if (zipcode) {
    await dependencies.setZipCode({ url, zipcode });
  }

  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 20000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }

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
    return !!variants
  });

  if (!variantsExist) {
    return;
  }

  try {
    id = id || url.match(/\/p\/(\d+)/)[1];
    if (id) {
    // API call to fetch variants
      const sku = url.match(/p\/(.+)\?s=/g)[0].replace('?s=', '').replace('p/', '');
      const storeUniqueId = zipcode === '95825' ? 1108 : url.match(/s=(\d+)/g)[0].replace('s=', '');
      const productDetails = await getData(`https://www.totalwine.com/product/api/product/product-detail/v1/getProduct/${sku}?shoppingMethod=INSTORE_PICKUP&state=US-CA&storeId=${storeUniqueId}`);
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
      }, productDetails);
      return true;
    }
  } catch (err) {
    console.log('ERROR while calling the API' + err);
    throw err;
  }
  try {
    await context.waitForSelector('#avg-rating-button', { timeout: 10000 }).catch(err => { console.log('No rating found', err); });
    await context.hover('#avg-rating-button');
    await context.hover('h1[class^="productTitle"]');
    return true;
  } catch (err) {
    console.log('cannot hover on rating');
  }
};

module.exports = { implementation };
