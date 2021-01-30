/**
 *
 * @param { { keywords: string, zipcode: string, storeID: string ,query: string} } inputs
 */

/* eslint-disable no-unmodified-loop-condition */
const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'bestbuy',
    transform,
    domain: 'bestbuy.ca',
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
  const { productDetails } = dependencies;

  const { keywords, results } = inputs;

  // await context.evaluate(async (keywords) => {
  //   function addHiddenDiv (id, content) {
  //     const newDiv = document.createElement('div');
  //     const innerDiv = document.createElement('div');
  //     newDiv.appendChild(innerDiv);
  //     newDiv.id = id;
  //     innerDiv.textContent = content;
  //     newDiv.style.display = 'none';
  //     document.body.appendChild(newDiv);
  //   }

  //   while (!document.querySelector('button[class*="loadMore"]') && !document.querySelector('div[class*="endOfList"]')) {
  //     await new Promise((resolve) => setTimeout(resolve, 1000));
  //   }

  //   let index = 0;
  //   let i = 0;
  //   let scrollTop = 0;
  //   while (index < 6) {
  //     i = index + 1;
  //     await new Promise((resolve) => setTimeout(resolve, 2000));
  //     if (document.querySelector('div[class*="endOfList"]')) {
  //       while (scrollTop !== 5000 * i) {
  //         await new Promise((resolve) => setTimeout(resolve, 1000));
  //         scrollTop += 250;
  //         window.scroll(0, scrollTop);
  //         if (scrollTop === 5000 * i) {
  //           await new Promise((resolve) => setTimeout(resolve, 1000));
  //           break;
  //         }
  //       }
  //       break;
  //     }
  //     // @ts-ignore
  //     document.querySelector('button[class*="loadMore"]').click();
  //     await new Promise((resolve) => setTimeout(resolve, 5000));
  //     while (scrollTop !== 5000 * i) {
  //       await new Promise((resolve) => setTimeout(resolve, 1000));
  //       scrollTop += 250;
  //       window.scroll(0, scrollTop);
  //       if (scrollTop === 5000 * i) {
  //         await new Promise((resolve) => setTimeout(resolve, 1000));
  //         break;
  //       }
  //     }
  //     index++;
  //   }

  //   let thumbnails;
  //   for (let j = 1; j < 8; j++) {
  //     thumbnails = await fetch(`https://www.bestbuy.ca/api/v2/json/search?categoryid=&currentRegion=ON&include=facets%2C%20redirects&lang=fr-CA&page=${j}&pageSize=24&path=&query=${keywords}&exp=&sortBy=relevance&sortDir=desc`).then(resp => resp.json());
  //     for (let k = 0; k < thumbnails.products.length; k++) {
  //       console.log('------------------------------------', thumbnails.products[k].thumbnailImage.replace('150x150', '250x250'));
  //       addHiddenDiv('thumbnails', thumbnails.products[k].thumbnailImage.replace('150x150', '250x250'));
  //     }
  //   }
  // }, [keywords]);

  const response = await context.evaluate(async function ([keywords, results]) {
    // eslint-disable-next-line prefer-const
    let dataObj = [];
    let total = 0;

    if (keywords) {
      for (let j = 1; dataObj.length < results; j++) {
        console.log('Page no. : ', j);
        const data = await fetch(`https://www.bestbuy.ca/api/v2/json/search?categoryid=&currentRegion=ON&include=facets%2C%20redirects&lang=fr-CA&page=${j}&pageSize=24&path=&query=${keywords}&exp=&sortBy=relevance&sortDir=desc`)
          .then(response => response.json());
        total = data.total;
        if (dataObj.length === Number(total)) {
          break;
        }
        data.products.forEach(item => {
          dataObj.push(item);
        });
      }
    }
    console.log('Product Count: ', dataObj.length);
    return dataObj;
  }, [keywords, results]);

  console.log('Product Count: ', response.length);

  if (response && response.length) {
    console.log('Products Found.');
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
          const searchUrl = `https://www.bestbuy.ca/fr-ca/chercher?search=${keywords}%27`;
          !document.querySelector('div[id*="search-url"]') && addElementToDocument('search-url', searchUrl);
        }
        addDataToDocument('id', element.sku, rowId);
        addDataToDocument('pd_url', element.productUrl, rowId);
        element.salePrice && addDataToDocument('pd_price', `$${String(element.salePrice)}`, rowId);
        element.regularPrice && addDataToDocument('pd_listprice', `$${String(element.regularPrice)}`, rowId);
        addDataToDocument('pd_name', element.name, rowId);
        addDataToDocument('pd_thumbnail', element.thumbnailImage.replace('150x150', '250x250'), rowId);
        addDataToDocument('pd_rating', element.customerRating, rowId);
        addDataToDocument('pd_review', element.customerReviewCount, rowId);
        if (element.seller) {
          addDataToDocument('pd_seller', 'Vendeur de la Place de marché', rowId);
        }
      }
    }, { response, results, keywords });
  }

  return await context.extract(productDetails, { transform });
}
