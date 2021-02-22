async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productReviews } = dependencies;
  await context.evaluate(async () => {
    const shadowDiv = Array.from(document.getElementsByClassName('onetrust-pc-dark-filter'));
    if (shadowDiv[0]) {
      shadowDiv[0].style.display = 'none';
      shadowDiv[0].style.removeProperty('z-index');
    }
    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }

    const getAllXpath = (xpath, prop) => {
      const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      const result = [];
      for (let index = 0; index < nodeSet.snapshotLength; index++) {
        const element = nodeSet.snapshotItem(index);
        if (element) result.push(prop ? element[prop] : element.nodeValue);
      }
      return result;
    };

    const getXpath = (xpath, prop) => {
      const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
      let result;
      if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
      else result = elem ? elem.singleNodeValue : '';
      return result && result.trim ? result.trim() : result;
    };

    
    const reviewXpath = getAllXpath("/html/body/pre/text()",'nodeValue');
    //console.log("reviewXpath::::", reviewXpath);
   // const idObj = JSON.stringify(reviewXpath);
   //var Information = JSON.parse(document.querySelector('body > pre').nodeValue);
      //addElementToDocument('sku', Information.name);
      //console.log("name:::", Information.results);
      // @ts-ignore
      var Information = JSON.parse(reviewXpath);
      //console.log("name1:::", Information.results);
      var jsonValue = JSON.stringify(Information.paging);
      var jsonPas = JSON.parse(jsonValue);
      console.log("jsonPas:::", JSON.stringify(jsonPas));
      var jsonArray = jsonValue.split(',');


      for(let i=0; i< jsonArray.length ; i++){
        //console.log("jsonArray elements:::", jsonArray[i]);
      }



  });
  return await context.extract(productReviews, { transform });
}

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'US',
    store: 'bjs',
    transform: null,
    domain: 'bjs.com',
    zipcode: "''",
  },
  implementation,
};


// async function implementation (
//   inputs,
//   parameters,
//   context,
//   dependencies,
// ) {
//   const { productReviews } = dependencies;

//   const cssCookiesDiv = '.container';
//   const cssCookies = 'button#consent_prompt_submit';
//   const cssReviews = 'a[data-test="reviews-flag-link"]';
//   const cssReviewsRow = 'div[data-test="review-item"]';
//   const cssShowMore = 'button[data-test="show-x-more-reviews-button"]';

//   const isSelectorAvailable = async (cssSelector) => {
//     return await context.evaluate(function (selector) {
//       return !!document.querySelector(selector);
//     }, cssSelector);
//   };

//   await context.waitForSelector(cssCookiesDiv, { timeout: 1000000 });

//   const coockiesAvailable = await isSelectorAvailable(cssCookies);
//   if (coockiesAvailable) {
//     await context.click(cssCookies);
//   }

//   const reviewsAvailable = await isSelectorAvailable(cssReviews);
//   if (reviewsAvailable) {
//     await context.click(cssReviews);
//   }

//   await context.waitForSelector(cssReviewsRow, { timeout: 500000 });

//   const showMoreAvailable = await isSelectorAvailable(cssShowMore);
//   console.log(`showMoreAvailable: ${showMoreAvailable}`);
//   if (showMoreAvailable) {
//     await context.waitForNavigation({ timeout: 200000, waitUntil: 'load' });
//     await context.evaluate(async function () {
//       let moreReviews = true;
//       while (moreReviews) {
//         const reviewsButton = document.querySelector('button[data-test="show-x-more-reviews-button"]');
//         if (reviewsButton) {
//           reviewsButton.click();
//           await new Promise((resolve, reject) => setTimeout(resolve, 400000));
//         } else {
//           moreReviews = false;
//         }
//       }
//     });
//   }

//   return await context.extract(productReviews);
// }
// module.exports = {
//     implements: 'product/reviews/extract',
//     parameterValues: {
//       country: 'US',
//       store: 'bjs',
//       transform: null,
//       domain: 'bjs.com',
//       zipcode: "''",
//     },
//     implementation,
//   };
