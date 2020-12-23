
const { transform } = require('./transform');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AT',
    store: 'douglas',
    transform,
    domain: 'douglas.at',
    zipcode: '',
  },
  // implementation: async function implementation (
  //   inputs,
  //   parameters,
  //   context,
  //   dependencies,
  // ) {
  //   const { transform } = parameters;
  //   const { productDetails } = dependencies;
  //   try {
  //     await context.evaluate(() => {
  //     // @ts-ignore

  //       const products = [...document.querySelectorAll('div .product-grid-column')];
  //       context.await(3000);
  //       products.forEach(async (product) => {
  //         let url = product.querySelector('a').getAttribute('href');
  //         url = url.split('/');
  //         let prodId = '';
  //         if (url[3]) {
  //           const params = url[3].split('?variant=');
  //           if (params.length === 1) {
  //             prodId = params[0];
  //           } else if (params.length === 2) {
  //             prodId = params[1];
  //           }
  //         }
          
  //         await context.waitForSelector('a[class*="link link--no-decoration"]')
  //         const res = await fetch(`https://www.douglas.at/api/v2/products/${prodId}`);
  //         const data = await res.json();
  //         if (data.code) {
  //           product.setAttribute('sku', data.code);
  //         }
  //         if (data.numberOfReviews) {
  //           product.setAttribute('review-count', data.numberOfReviews);
  //         }
  //         if (data.averageRating) {
  //           let aggregateRating = data.averageRating.toString();
  //           aggregateRating = aggregateRating.replace('.', ',');
  //           product.setAttribute('aggregate-rating', aggregateRating);
  //         }
  //         if (data.ean) {
  //           product.setAttribute('gtin', data.ean);
  //         }
  //         if (data.price) {
  //           product.setAttribute('price', data.price.formattedValue);
  //         }

  //         const currentUrl = window.location.href;
  //         product.setAttribute('search-url', currentUrl);
  //       });
  //     });
  //   } catch (e) {
  //     console.log(e.message);
  //   }
    
  // // function to get the json data from the string
  
  // function findJsonData (scriptSelector, startString, endString) {
  //   try {
  //     const xpath = `//script[@id="state-body"]`;
  //     const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  //     const scriptContent = element.textContent;
  //     const startIdx = scriptContent.indexOf(startString);
  //     const endIdx = scriptContent.indexOf(endString);
  //     let jsonStr = scriptContent.substring(startIdx + startString.length, endIdx);
  //     jsonStr = jsonStr.trim();
  //     return JSON.parse(jsonStr);
  //     console.log(JSON.stringify(window.__INITIAL_STATE__))
  //   } catch (error) {
  //     console.log('Failed to find JSON Data ', error.message);
  //   }
  // }
  // return await context.extract(productDetails, { transform });
  // },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));
    await context.evaluate(async () => {
      const closePopupButton = document.querySelector('button[class="button button__primary"] ');
      if (closePopupButton !== null) {
      closePopupButton.click();
      console.log("button clicked");
      }
      });
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 20000) {
          await stall(500);
          scrollTop += 500;
          window.scroll(0, scrollTop);
          if (scrollTop === 20000) {
            await stall(2000);
            break;
          }
        }
        function stall (ms) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }
      });
    };
    await applyScroll(context);
    await context.waitForSelector('div[class="image-container image-container--loaded image-container--calculated-height"]', { timeout: 10000 });
    return await context.extract(productDetails, { transform });
  },
};

 
