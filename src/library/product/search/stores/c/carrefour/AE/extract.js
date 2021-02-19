const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AE',
    store: 'carrefour',
    transform,
    domain: 'carrefouruae.com',
    zipcode: "''",
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    await context.evaluate(async () => {

      function addHiddenDiv (el, myClass, content) {
        const newDiv = document.createElement('div');
        newDiv.setAttribute('class', myClass);
        newDiv.textContent = content;
        // newDiv.style.display = 'none';
        el.appendChild(newDiv);
      }

      let apiData = [];
      const refURL = window.location.href;
      let searchTerm = '';
      const serachTermSel = document.querySelector('input[name="inputText"]');
      if (serachTermSel) {
        searchTerm = serachTermSel.getAttribute('value')
      }
      async function fetchProducts (fetchURL) {
        console.log('fetchURL: ', fetchURL);
  
        const response = await fetch(fetchURL, {
          headers: {
            'storeId': 'mafuae',
            'env': 'prod',
            'appId': 'Reactweb'
          },
          referrer: refURL,
          referrerPolicy: 'no-referrer-when-downgrade',
          body: null,
          method: 'GET',
          mode: 'cors',
        });
  
        if (response && response.status === 200) {
          console.log('Product Found!!!!');
          const data = await response.json();
          return data;
        }
      }

      const pageNum = 0;
      const apiUrl = `https://www.carrefouruae.com/api/v3/zones/072/search/advance?keyword=${searchTerm}&filter=&sortBy=relevance&currentPage=0&pageSize=60&maxPrice=&minPrice=&areaCode=Dubai%20Festival%20City%20-%20Dubai&lang=en&nextOffset=0&expressPos=003&disableSpellCheck=&displayCurr=AED`;

      const firstPageData = await fetchProducts(apiUrl);
      console.log('firstPage data ====', JSON.stringify(firstPageData));
      if (firstPageData && firstPageData.products) {
        firstPageData.products.forEach(element => {
          apiData.push(element);
        });
      }

      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }

      let scrollTop = 0;
      while (scrollTop !== 5000) {
        await stall(1000);
        scrollTop += 500;
        window.scroll(0, scrollTop);
        if (scrollTop === 5000) {
          await stall(500);
          break;
        }
      }

      const moreButtonSelector = document.querySelector('button.ltr-1upsixo');
      if (moreButtonSelector) {
        for (let index = 1; index < 3; index++) {

          const pageNum = index;
          const apiUrl = `https://www.carrefouruae.com/api/v3/zones/072/search/advance?keyword=${searchTerm}&filter=&sortBy=relevance&currentPage=${pageNum}&pageSize=60&maxPrice=&minPrice=&areaCode=Dubai%20Festival%20City%20-%20Dubai&lang=en&nextOffset=0&expressPos=003&disableSpellCheck=&displayCurr=AED`;
          console.log('apiUrl === ', apiUrl);
          const pageData = await fetchProducts(apiUrl);
          console.log('pageData === ', pageData);
          if (pageData && pageData.products) {
            pageData.products.forEach(element => {
              apiData.push(element);
            });
          }

          // const temMoreButtonSelector = document.querySelector('button.ltr-1upsixo');
          // if (temMoreButtonSelector) {
          //   try {
          //     temMoreButtonSelector.click();
          //     await new Promise((resolve, reject) => setTimeout(resolve, 2000));
          //     let scrollTop = 0;
          //     while (scrollTop !== 10000) {
          //       await stall(1000);
          //       scrollTop += 500;
          //       window.scroll(0, scrollTop);
          //       if (scrollTop === 10000) {
          //         await stall(500);
          //         break;
          //       }
          //     }  
          //   } catch (err) {}
          // }          
        }
      }

      if (apiData) {
        const prodContainer = document.querySelector('ul[data-testid*="scrollable-list-view"] div div div');
        apiData.forEach((element, index) => {
          const id = element.id;
          const name = element.name;
          const price = element.price.formattedValue;
          let prodUrl = '';
          // const available = element.availability.isAvailable;
          // let availabilityTxt = 'Out of Stock';
          // if (available) {
          //   availabilityTxt = 'In Stock';
          // }
          const manufacturer = element.brand.name;
          let img = '';
          const links = element.links;
          if (links) {
            links.forEach(link => {
              if (link.kind === 'image') {
                img = link.href;
              }
              if (link.kind === 'product') {
                prodUrl = `https://www.carrefouruae.com/${link.href}`;
              }
            });
          }

          addHiddenDiv(prodContainer, "my-custom-id", id);
          addHiddenDiv(prodContainer, "my-custom-name", name);
          addHiddenDiv(prodContainer, "my-custom-price", price);
          addHiddenDiv(prodContainer, "my-custom-prodUrl", prodUrl);
          // addHiddenDiv(prodContainer, "my-custom-availability", availabilityTxt);
          addHiddenDiv(prodContainer, "my-custom-img", img);
          addHiddenDiv(prodContainer, "my-custom-manufacturer", manufacturer);
        });  
      }

      // const moreButton = document.evaluate('//div[contains(@class,"LoadMore__Wrapper-")]//button', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      // let moreButton = document.evaluate('//button[@class="ltr-1upsixo"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      // console.log('moreButton:: ', moreButton.singleNodeValue);
      // if (moreButton && moreButton.singleNodeValue != null) {
      //   let index = 0;
      //   while (index < 3) {
      //     try {
      //       moreButton = document.evaluate('//button[@class="ltr-1upsixo"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      //       moreButton.singleNodeValue.click();
      //       console.log('more button clicked: ', index);
      //       index++;
      //       await new Promise((resolve, reject) => setTimeout(resolve, 2000));
      //       let scrollTop = 0;
      //       while (scrollTop !== 10000) {
      //         await stall(1000);
      //         scrollTop += 500;
      //         window.scroll(0, scrollTop);
      //         if (scrollTop === 10000) {
      //           await stall(500);
      //           break;
      //         }
      //       }
      //     } catch (e) {
      //       console.log('error on more button: ', e);
      //     }
      //   }
      // }
      return apiData;
    });
    return await context.extract(productDetails, { transform });
  },
};
//   implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
//     await new Promise((resolve, reject) => setTimeout(resolve, 3000));
//     const applyScroll = async function (context) {
//       await context.evaluate(async function () {
//         let count = document.querySelectorAll('ul[data-testid="scrollable-list-view"] div[class="ltr-6hrfmx"]').length;
//         let itercnt = 0;
//         while (itercnt < 2) {
//           // const oldCount = count;
//           try {
//             // document.querySelector('button.ltr-1upsixo') && document.querySelector('button.ltr-1upsixo').click();
//             // await new Promise(resolve => setTimeout(resolve, 2000));
//             // count = document.querySelectorAll('ul[data-testid="scrollable-list-view"] div[class="ltr-6hrfmx"]').length;
//             const scrollElement = document.querySelector('ul[data-testid="scrollable-list-view"] > li');
//             const moreBtn = document.querySelector('button.ltr-1upsixo');
//             // await new Promise((resolve, reject) => setTimeout(resolve, 3000));
//             // if (scrollElement) {
//             if (moreBtn) {  
//               if (scrollElement)
//                 scrollElement.scrollIntoView({ behaviour: 'smooth', block: 'end' });
//               await new Promise(resolve => setTimeout(resolve, 2000));
//               document.querySelector('button.ltr-1upsixo').click();
//             }  
//           } catch (err) {
//           }
//           itercnt++;
//           // if (oldCount === count) {
//           //   break;
//           // }
//         }
//       });
//     };
//     // await applyScroll(context);

//     await new Promise((resolve, reject) => setTimeout(resolve, 1000));
//     return await context.extract(productDetails, { transform });
//   },
// };
