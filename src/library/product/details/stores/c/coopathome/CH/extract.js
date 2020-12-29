const { transform } = require('../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  console.log('inputs:: ', inputs);
  let { url, id } = inputs;
  console.log('parameters:: ', parameters);
  if (id) {
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));

    const prodUrl = await context.evaluate(() => {
      const urlSel = document.querySelector('div.productTile__wrapper a');
      if (urlSel) {
        return urlSel.href;
      } else {
        return '';
      }
    });
    console.log('prodUrl is ', prodUrl);

    if (prodUrl && prodUrl.length > 0) {
      await context.goto(prodUrl, { timeout: 20000, waitUntil: 'load', checkBlocked: true });
      // await context.evaluate(() => {
      //   const doc = document.querySelectorAll('script[type="application/ld+json"]');
      //   let text = '';
      //   for(let i = 0; i < doc.length; i++) {
      //     const txt = doc[i].innerText;
      //     text = text + txt;
      //     if (txt.indexOf('gtin') > -1) {
      //       const data = JSON.parse(txt);
      //       const gtin = data.gtin8;

      //       const newDiv = document.createElement('div');
      //       newDiv.id = 'myGtin';
      //       newDiv.textContent = gtin; 
      //       newDiv.style.display = 'none';
      //       document.body.appendChild(newDiv);
      //       return txt;
      //     }
      //   }
      //   return '';
      // });
      // await fetchContent(prodUrl);
      // await context.evaluate(() => {
      //   context.goto(url, {
      //     block_ads: false,
      //     load_all_resources: true,
      //     images_enabled: true,
      //     timeout: 10000,
      //     waitUntil: 'load',
      //   });
      // });
    } 
    // await context.waitForXPath('//a[@class="productTile "]/@href');

    // await context.waitForSelector('a.productTile');
    // console.log('everything fine !!!');
    // await context.evaluate(() => {
    //   const firstItem = document.querySelector('a.productTile');
    //   console.log('https://www.coop.ch/de' + firstItem);
    //   detailsurl = 'https://www.coop.ch/de' + firstItem;
    //   console.log('firstItem', firstItem);
    //   // firstItem.click();
    //   url = `${detailsurl}#[!opt!]{"first_request_timeout":50000, "force200": true}[/!opt!]`;
    //   context.goto(url, {
    //     block_ads: false,
    //     load_all_resources: true,
    //     images_enabled: true,
    //     timeout: 10000,
    //     waitUntil: 'load',
    //   });

    // });
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));
  }
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'coopathome',
    transform: transform,
    domain: 'coop.ch',
    zipcode: '',
  },
  implementation,
};
