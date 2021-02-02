async function implementation (
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
    try {
      await context.waitForFunction(function (sel, xp) {
        return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
      }, { timeout: 25000 }, parameters.loadedSelector, parameters.noResultsXPath);
    } catch(err) {
      console.log('we had some issue while waiting', err.message);
    }
  }

  let thisPageHasProdId = false;
  let allNameSel = 'a[class*="product-titel"]';
  let allNamesLoaded = false;
  try {
    await context.waitForSelector(allNameSel);
    console.log('got some names');
    allNamesLoaded = true;
  } catch(err) {
    console.log('got some error while waiting for names to load on the search page', err.message);
  }

  if(allNamesLoaded) {
    thisPageHasProdId = await context.evaluate(async (allNameSel, id) => {
      console.log('allNameSel', allNameSel);
      console.log('id', id);
      let allNamesElms = document.querySelectorAll(allNameSel);
      let thisPageHasProdId = false;
      if(allNamesElms) {
        for(let i = 0; i < allNamesElms.length; i++) {
          let url = allNamesElms[i].getAttribute('href');
          console.log('url', url);
          let thisId = url.split('/').pop();
          if(thisId.toString() === id.toString()) {
            thisPageHasProdId = true;
            break;
          }
        }
      }
      return thisPageHasProdId;
    }, allNameSel, id);
  }

  if(!thisPageHasProdId) {
    console.log("this page does not have the product id mentioned in the input");
    return thisPageHasProdId;
  }

  let gotTheProdId = false;
  let allProdCount = await context.evaluate(async (allNameSel)=> {
    console.log('allNameSel', allNameSel);
    let allNamesElms = document.querySelectorAll(allNameSel);
    if(allNamesElms) {
      return allNamesElms.length;
    }
    return 0;
  }, allNameSel);

  if (id) {
    let i = 0;
    while(allProdCount > i && (!gotTheProdId)) {
      const pageLink = await context.evaluate(async (i) => {return (document.querySelectorAll('.product-image-link')[i].getAttribute('href'))}, i);
      const rpc = pageLink.split('/').pop();
      if (id.toString() === rpc.toString()) {
        await context.goto(pageLink, {
          blockAds: false,
          loadAllResources: true,
          imagesEnabled: true,
          timeout: 100000,
          waitUntil: 'networkidle0',
        });
        gotTheProdId = true;
        try {
          await context.waitForSelector('div[class*="is-button-buy"]', { timeout: 100000 });
        } catch(err) {
          console.log('we got some error while waiting for add to cart btn', err.message);
          try {
            await context.waitForSelector('div[class*="is-button-buy"]', { timeout: 100000 });
          } catch(error) {
            console.log('we got some error while waiting for add to cart btn - again', error.message);
          }
        }
      } else {
        await context.evaluate(() => {
          document.querySelector('meta[property="og:image"]').setAttribute('content', '');
        });
      }
      i++;
    }
    //await context.waitForSelector('.product-image-link');
    
  }

  console.log('gotTheProdId', gotTheProdId);
  if(!gotTheProdId) {
    console.log("this page has the id but we could not get the page link");
    return gotTheProdId;
  }
  await context.waitForSelector('div[class*="is-button-buy"]', { timeout: 100000 });
  await context.evaluate(() => {
    const div = document.evaluate("//div[contains(@class,'product-detail-buy')]//div[contains(@class,'custom-price-style') and not (contains(@class,'instead'))]", document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext();
    if (div.innerText.includes('.')) {
      div.innerText = div.innerText.replace(',', '.').replace('\n', '').replace('.', ',');
    } else {
      div.innerText = div.innerText.replace(',', '.').replace('\n', '');
    }
    const ava2 = document.createElement('div');
    ava2.setAttribute('id', 'availablity');
    ava2.innerText = 'In Stock';
    document.body.append(ava2);
    if (document.querySelector('div[class*="custom-detail-short-description"]')) {
      const desc = document.querySelector('div[class*="custom-detail-short-description"]').innerText;
      const name = document.querySelector('h2[class*="custom-detail-headline"]');
      name.innerText = name.innerText + ' ' + desc;
    }
  });
  return await context.evaluate((xpath) => !document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue, parameters.noResultsXPath);
}
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AT',
    store: '0815',
    domain: '0815.at',
    loadedSelector: "div[class*='custom-rating-overlay']",
    noResultsXPath: '//h1[contains(.,"1 Produ")]',
    zipcode: '',
  },
  implementation,
};
