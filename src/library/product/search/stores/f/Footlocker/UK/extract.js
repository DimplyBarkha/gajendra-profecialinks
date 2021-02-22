const { transform } = require('../../../../shared')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'Footlocker',
    transform,
    domain: 'footlocker.co.uk',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 20000) {
          scrollTop += 1000;
          window.scroll(0, scrollTop);
          await stall(3000);
        }
        function stall(ms) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }
      });
    };
    await applyScroll(context);
    async function getProductsCount(context) {
      return context.evaluate(async function () {
        const products = document.evaluate('//div[@class="fl-product-tile--basic"]//picture[@class="fl-picture"]/img/@srcset', document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        return products.snapshotLength;
      });
    }
    let productsCount = 0;
    while (productsCount < 150) {
      const doesLoadMoreExists = await context.evaluate(function () {
        return Boolean(document.querySelector('.text-center > div > .fl-btn--inner'));
      });
      if (doesLoadMoreExists) {
        await context.evaluate(async function () {
          console.log('Clicking on load more button');
          document.querySelector('.text-center > div > .fl-btn--inner').click();
          await new Promise((resolve, reject) => setTimeout(resolve, 10000));
        });
        async function autoScroll(page) {
          await page.evaluate(async () => {
            await new Promise((resolve, reject) => {
              var totalHeight = 0;
              var distance = 100;
              var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
    
                if (totalHeight >= scrollHeight) {
                  clearInterval(timer);
                  resolve();
                }
              }, 100);
            });
          });
        }
        await autoScroll(context);
        productsCount = await getProductsCount(context);
        console.log('productsCount' + productsCount);
        if (productsCount >= 150) {
          break;
        }
        await applyScroll(context);
      } else {
        break;
      }
    }

    // async function addProductName(node) {
    //   function appendData(node, html) {
    //     if (html !== 'false') {
    //       node.innerHTML = "";
    //       node.innerHTML = html;
    //     }
    //   }
    //   const nodes = Array.from(document.querySelectorAll('div[data-lazyloading-content-handler="lazyloadingJSONContentHandler"]'));
    //   const promises = await Promise.all(nodes.map(node => fetch(node.getAttribute('data-request'))));
    //   const data = (await Promise.all(promises.map((response, i) => { if (response.status === 200) return response.json(); return { content: false } }))).map(elm => unescape(elm.content));
    //   nodes.forEach((node, i) => appendData(node, data[i]))
    // }
    // await context.evaluate(addProductName);
    // async function addProductDetails() {
    // const nodes = Array.from(document.querySelectorAll('div[data-lazyloading-content-handler="lazyloadingJSONContentHandler"]'));
    // const urlsAPI = nodes.map(elm => elm.getAttribute('data-request'));
    // const promises = urlsAPI.map(url => getProductNameFromUrl(url));
    // const productNames = await Promise.all(promises);
    // await Promise.all(promises);
    // const promises = await Promise.all(nodes.map(node => fetch(node.getAttribute('data-request'))));
    // const productNames = (await Promise.all(promises.map(response => response.json()))).map(elm => unescape(elm.content));
    // await Promise.all(promises);
    // for (let index = 0; index < nodes.length; index++) {
    //   nodes[index].setAttribute('productName', productNames[index]);
    //   nodes[index].setAttribute('productPrice', productNames[index]);
    //   nodes[index].setAttribute('productUrl', productNames[index]);
    //   nodes[index].setAttribute('productImage', productNames[index]);
    //   nodes[index].setAttribute('productId', productNames[index]);
    //   nodes[index].setAttribute('productReview', productNames[index]);
    //   nodes[index].setAttribute('productRating', productNames[index]);
    // }
    // }

    // async function addProductDetails () {
    //   async function getProductCodeFromUrl (url) {
    //     const response = await fetch(url);
    //     const html = await response.text();
    //     // const code = html.match(/(name=\"SKU\" value=\")([^\"]+)/);
    //     if (!html) return '';
    //     return html;
    //   }
    //   const nodes = Array.from(document.querySelectorAll('div[data-lazyloading-content-handler="lazyloadingJSONContentHandler"]'));
    //   const urls = nodes.map(elm => elm.getAttribute('data-request'));
    //   const promises = urls.map(url => getProductCodeFromUrl(url));
    //   const productNames = await Promise.all(promises);
    //   await Promise.all(promises);
    //   for (let index = 0; index < nodes.length; index++) {
    //     nodes[index].setAttribute('productName', productNames[index]);
    //     nodes[index].setAttribute('productPrice', productNames[index]);
    //     nodes[index].setAttribute('productUrl', productNames[index]);
    //     nodes[index].setAttribute('productImage', productNames[index]);
    //     nodes[index].setAttribute('productId', productNames[index]);
    //     nodes[index].setAttribute('productReview', productNames[index]);
    //     nodes[index].setAttribute('productRating', productNames[index]);
    //   }
    // }
    // await context.evaluate(addProductDetails);

    // async function addProductDetails(node) {
    //   function appendData(node, html) {
    //     if (html !== 'false') {
    //       node.innerHTML = "";
    //       node.innerHTML = html;
    //     }
    //   }
    //   const nodes = Array.from(document.querySelectorAll('div[data-lazyloading-content-handler="lazyloadingJSONContentHandler"]'));
    //   const promises = await Promise.all(nodes.map(node => fetch(node.getAttribute('data-request'))));
    //   const data = (await Promise.all(promises.map((response, i) => { if (response.status === 200) return response.json(); return { content: false } }))).map(elm => unescape(elm.content));
    //   nodes.forEach((node, i) => appendData(node, data[i]))
    // }
    // try {
    // await context.evaluate(addProductDetails);
    // }
    // catch {
    // console.log('error is coming')
    // }
    // async function addProductCode () {
    //   async function getProductCodeFromUrl (url) {
    //     const response = await fetch(url);
    //     const html = await response.text();
    //     const code = html.match(/( \[{position:"0",id:")([^"]+)/);
    //     if (!code) return '';
    //     return code[2];
    //   }
    //   async function addElementToDocument(key, value) {
    //     const catElement = document.createElement('div');
    //     catElement.id = key;
    //     catElement.textContent = value;
    //     catElement.style.display = 'none';
    //     document.body.appendChild(catElement);
    //   }
    //   const nodes = Array.from(document.querySelectorAll('div[class="fl-product-tile--basic"]>a'));
    //   const urls = nodes.map(elm => elm.href);
    //   const promises = urls.map(url => getProductCodeFromUrl(url));
    //   const productCodes = await Promise.all(promises);
    //   await Promise.all(promises);
    //   // if (productCodes) {
    //   //   addElementToDocument('elementData1', productCodes);
    //   // }
    //   for (let index = 0; index < nodes.length; index++) {
    //     addElementToDocument('elementData1', productCodes[index]);
    //   }
    // }
    // await context.evaluate(addProductCode);
    return await context.extract(productDetails, { transform, type: 'MERGE_ROWS' });
  },
};
