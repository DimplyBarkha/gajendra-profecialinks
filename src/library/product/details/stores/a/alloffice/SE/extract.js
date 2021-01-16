const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SE',
    store: 'alloffice',
    transform: cleanUp,
    domain: 'alloffice.se',
    zipcode: '',
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {

    // need to check if this is a product page or a listing page -- 
    let listingPageXpath = '//a[contains(@data-test-id,"product-link")][//h1[contains(.,"Sökresultat för")]]';
    let listingPageLoaded = false;
    let sku = inputs.id;
    try {
      console.log(sku);
      console.log('waiting for page load!');
      await context.waitForXPath(listingPageXpath);
      listingPageLoaded = true;
      console.log('waiting done!!');
    } catch(err) {
      console.log('error while loading the page!!', err.message);
      try {
        console.log('waiting for page load! again');
        await context.waitForXPath(listingPageXpath);
        listingPageLoaded = true;
        console.log('waiting done!!');
      } catch(error) {
        console.log('error while loading the page!! again', error.message);
      }
    }

    if(listingPageLoaded) {
      console.log('we have a listing page here!!');
      await context.evaluate(async (listingPageXpath, sku) => {
        let allElms = document.evaluate(listingPageXpath, document, null, 7, null);
        for(let i = 0; i < allElms.snapshotLength; i++) {
          if(allElms.snapshotItem(i) && allElms.snapshotItem(i).hasAttribute('href') && allElms.snapshotItem(i).getAttribute('href').includes(sku)) {
            console.log(allElms.snapshotItem(i).getAttribute('href'));
            allElms.snapshotItem(i).click();
            console.log('clicked on the prod');
            break;
          }
        }
      },
      listingPageXpath,
      sku);
    } else {
      console.log('we might have product page!!');
    }
    await new Promise(resolve => setTimeout(resolve, 15000));
    
    await context.evaluate(() => {
      const rpc = document.querySelector('meta[property="product:retailer_item_id"]').getAttribute('content');
      const imgs = document.querySelectorAll('img');
      const div = document.createElement('div');
      div.setAttribute('id', 'altImages');
      for (let i = 0; i < imgs.length; i++) {
        if ((imgs[i].getAttribute('alt') + ' ').includes(rpc)) {
          const link = 'https://www.alloffice.se' + imgs[i].getAttribute('src');
          imgs[i].setAttribute('src', link.split('&w')[0]);
          div.appendChild(imgs[i]);
        }
      }
      document.querySelector('div[id="container"]').append(div);
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
