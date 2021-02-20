// const { transform } = require('../format');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  console.log('inputs:: ', inputs);
  const { url, id } = inputs;
  console.log('parameters:: ', parameters);
  if (id) {
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));

    const prodUrl = await context.evaluate(() => {
      const urlSel = document.querySelector('div.ProductCard__ProductContainer-sc-2vuvzo-2.gVgtAI a');
      if (urlSel) {
        return urlSel.href;
      } else {
        return '';
      }
    });
    console.log('prodUrl is ', prodUrl);

    if (prodUrl && prodUrl.length > 0) {
      await context.goto(prodUrl, { timeout: 60000, waitUntil: 'load', checkBlocked: true });
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
  await context.evaluate(async function () {
    let scrollTop = 0;
    while (scrollTop <= 20000) {
      await stall(500);
      scrollTop += 1000;
      window.scroll(0, scrollTop);
      if (scrollTop === 20000) {
        await stall(5000);
        break;
      }
    }
    function stall (ms) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BR',
    store: 'casasbahia',
    // transform,
    domain: 'casasbahia.com.br',
    zipcode: "''",
  },
  // implementation: async (inputs,
  //   parameters,
  //   context,
  //   dependencies,
  // ) => {
  //   const { transform } = parameters;
  //   const { productDetails } = dependencies;
  //   await new Promise(resolve => setTimeout(resolve, 2000));

  //   await context.evaluate(async function () {
  //     let scrollTop = 0;
  //     while (scrollTop <= 20000) {
  //       await stall(500);
  //       scrollTop += 1000;
  //       window.scroll(0, scrollTop);
  //       if (scrollTop === 20000) {
  //         await stall(5000);
  //         break;
  //       }
  //     }
  //     function stall (ms) {
  //       return new Promise(resolve => {
  //         setTimeout(() => {
  //           resolve();
  //         }, ms);
  //       });
  //     }
  //   });
  //   await context.evaluate(async () => {
  //     // const descNode = document.querySelector('div.product-info-description');
  //     let desc = '';
  //     const images = [];
  //     // if (descNode && descNode.innerText) {
  //     //   desc = descNode.innerText;
  //     //   desc = desc.replace(/\n{1,}"/g, ' ').replace(/\s{1,}"/g, ' ');
  //     // }
  //     try {
  //       const descNode1 = document.querySelector('div.pd-image-full');
  //       await new Promise(resolve => setTimeout(resolve, 2000));
  //       if (descNode1 && descNode1.shadowRoot) {
  //         const fetchNode = descNode1.shadowRoot.firstChild;
  //         const text = fetchNode.innerText;
  //         desc = desc + text;
  //         const manImages = fetchNode.querySelectorAll('img');
  //         if (manImages && manImages.length > 0) {
  //           for (let i = 0; i < manImages.length; i++) {
  //             images.push(manImages[i].src);
  //           }
  //         }
  //       }
  //     } catch (err) { }
  //     if (images.length > 0) {
  //       const image = images.join(' | ');
  //       addHiddenDiv('manuf-images', image);
  //     }
  //     if (desc.length > 0) {
  //       addHiddenDiv('product-desc', desc);
  //     }
  //     function addHiddenDiv (id, content) {
  //       const newDiv = document.createElement('div');
  //       newDiv.id = id;
  //       newDiv.textContent = content;
  //       newDiv.style.display = 'none';
  //       document.body.appendChild(newDiv);
  //     }
  //     return [`desc.length = ${desc}`, `images : ${images.length}`];
  //   });
  //   await new Promise(resolve => setTimeout(resolve, 2000));
  //   // await context.evaluate(async function () {
  //   //   const desc = document.querySelector('div.syndi_powerpage');
  //   //   if (desc) {
  //   //     let text = desc.shadowRoot.firstChild.innerText;
  //   //     text = text.replace('/g\n\s{1,}/', '');
  //   //   }
  //   // })
  //   // }
  //   await new Promise((resolve) => setTimeout(resolve, 5000));
  //   return await context.extract(productDetails, { transform });
  // },
  implementation,
};
