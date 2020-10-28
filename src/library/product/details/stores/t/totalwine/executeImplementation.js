
const implementation = async function (
  inputs,
  parameters,
  context,
  dependencies,
) {
  let { url, id, zipcode, storeId } = inputs;
  if (!url) {
    if (!id) {
      throw new Error('no id provided');
    }
    url = await dependencies.createUrl({ id });
  }

  await dependencies.goto({ url, zipcode, storeId });

  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
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
    return variants.length > 1;
  });

  if (!variantsExist) {
    return;
  }
  // API call to fetch variants
  const sku = url.match(/(\d+)\?s=/g)[0].replace('?s=', '');
  const storeUniqueId = zipcode === '95825' ? 1108 : url.match(/s=(\d+)/g)[0].replace('s=', '');

  try {
    const productDetails = await getData(`https://www.totalwine.com/product/api/product/product-detail/v1/getProduct/${sku}?shoppingMethod=INSTORE_PICKUP&state=US-CA&storeId=${storeUniqueId}`);
    console.log('API call done');
    await context.evaluate(async function (data) {
      // Add skus to DOM
      const skus = document.querySelectorAll('ul[role="listbox"][class*="reset"] > li');
      for (let i = 0; i < skus.length; i++) {
        if (data.skuId === data.skus[i].skuId) {
          continue;
        }
        const newDiv = document.createElement('div');
        newDiv.setAttribute('class', 'itemId');
        newDiv.textContent = data.skus[i].skuId;
        newDiv.style.display = 'none';
        skus[i].appendChild(newDiv);
      }
    }, productDetails);
  } catch (err) {
    console.log('ERROR while calling the API' + err);
    throw err;
  }
};

module.exports = { implementation };
