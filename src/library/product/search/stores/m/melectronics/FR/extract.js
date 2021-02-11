/**
 *
 * @param { { keywords: string, zipcode: string, storeID: string ,query: string} } inputs
 */

/* eslint-disable no-unmodified-loop-condition */
const { transform } = require('./format');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const { keywords, results } = inputs;
  const response = await context.evaluate(async function ([keywords, results]) {
    const dataObj = [];
    if (keywords) {
      const data = await fetch(`https://www.melectronics.ch/jsapi/v1/fr/products/search?q=${keywords}&pageSize=${results}`)
        .then(response => response.json());
      data.products.forEach(item => {
        dataObj.push(item);
      });
      await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    }
    return dataObj;
  }, [keywords, results]);

  if (response && response.length) {
    await context.evaluate(async function ({ response, results, keywords }) {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      function addDataToDocument (key, value, mainNode) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.getElementById(mainNode).appendChild(catElement);
      }
      const l = response.length;
      for (let index = 0; index < l; index++) {
        if (results && index === Number(results)) {
          break;
        }
        const rowId = `pd_div_${index}`;
        const element = response[index];
        if (!document.querySelector(rowId)) {
          addElementToDocument(`pd_div_${index}`, index);
        }
        if (keywords) {
          const searchUrl = `https://www.melectronics.ch/jsapi/v1/fr/products/search?q=${keywords}`;
          !document.querySelector('div[id*="search-url"]') && addElementToDocument('search-url', searchUrl);
        }

        addDataToDocument('pd_id', element.code, rowId);
        addDataToDocument('pd_url', element.url, rowId);
        element.price && element.price.value && addDataToDocument('pd_price', `${String(element.price.value)}`, rowId);
        // element.regularPrice && addDataToDocument('pd_listprice', `$${String(element.regularPrice)}`, rowId);
        addDataToDocument('pd_name', element.name, rowId);
        if(element.brand) addDataToDocument('pd_brand_name', element.brand.name, rowId);
        addDataToDocument('pd_thumbnail', element.images[0].url.replace(/{stack}/g, 'fm-listing-product-2020-xs'), rowId);
        if(element.ratingAverage) addDataToDocument('pd_rating', element.ratingAverage, rowId);
        if(element.ratingCount) addDataToDocument('pd_review', element.ratingCount, rowId);
      }
    }, { response, results, keywords });
  }
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'melectronics',
    transform,
    domain: 'melectronics.ch',
    zipcode: "''",
  },
  implementation,
  // implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
  //   await context.evaluate(async () => {
  //     function stall (ms) {
  //       return new Promise((resolve, reject) => {
  //         setTimeout(() => {
  //           resolve();
  //         }, ms);
  //       });
  //     }

  //     function findPos (obj) {
  //       var curtop = 0;
  //       if (obj.offsetParent) {
  //         do {
  //           curtop += obj.offsetTop;
  //         } while (obj = obj.offsetParent);
  //         return [curtop];
  //       }
  //     }

  //     const moreButton = document.evaluate('//div[@class="p-product-listing--item p-product-listing--item__buttons"]//button[@class="btn btn__md btn__secondary"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
  //     if (moreButton && moreButton.singleNodeValue != null) {
  //       let lastScrollValue = 0;
  //       let scrollTop = 0;
  //       while (document.evaluate('//div[@class="p-product-listing--item p-product-listing--item__buttons"]//button[@class="btn btn__md btn__secondary"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue && document.evaluate("//div[contains(@class,'DlNoVpsv8MABrtE8wLdel')]//a", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength <= 160) {
  //         await new Promise((resolve, reject) => setTimeout(resolve, 1000));
  //         document.evaluate('//div[@class="p-product-listing--item p-product-listing--item__buttons"]//button[@class="btn btn__md btn__secondary"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();
  //         await new Promise((resolve, reject) => setTimeout(resolve, 1000));
  //         // @ts-ignore
  //         while (scrollTop <= findPos(document.evaluate('//div[@class="footer--content"]//a[@title="Facebook"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue)[0]) {
  //           await stall(2000);
  //           lastScrollValue = scrollTop;
  //           scrollTop += 1000;
  //           window.scroll(lastScrollValue, scrollTop);
  //           // @ts-ignore
  //           if (scrollTop >= findPos(document.evaluate('//div[@class="footer--content"]//a[@title="Facebook"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue)[0] && document.evaluate("//div[contains(@class,'DlNoVpsv8MABrtE8wLdel')]//a", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength <= 160) {
  //             await stall(3000);
  //             break;
  //           }
  //         }
  //       }
  //     } else {
  //       await new Promise((resolve, reject) => setTimeout(resolve, 1000));
  //       let scrollTop = 0;
  //       while (scrollTop !== 6000) {
  //         await stall(1000);
  //         scrollTop += 1000;
  //         window.scroll(0, scrollTop);
  //         if (scrollTop === 5000) {
  //           await stall(500);
  //           break;
  //         }
  //       }
  //     }
  //   });
  //   return await context.extract(productDetails, { transform });
  // },
};
