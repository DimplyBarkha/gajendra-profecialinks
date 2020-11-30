const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BR',
    store: 'roge',
    transform: transform,
    domain: 'roge.com.br',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    const { url, id } = inputs;
    if (id) {
      await new Promise((resolve, reject) => setTimeout(resolve, 5000));
      await context.waitForXPath('//h2[@class="product-title"]/a');
      await context.waitForSelector('h2.product-title a');
      console.log('everything fine !!!');
      await context.evaluate(() => {
        const firstItem = document.querySelector('h2.product-title a');
        firstItem.click();
      });
    }

    //     await new Promise(resolve => setTimeout(resolve, 2000));

    //     await context.evaluate(async function () {
    //       let scrollTop = 0;
    //       while (scrollTop <= 20000) {
    //         await stall(500);
    //         scrollTop += 1000;
    //         window.scroll(0, scrollTop);
    //         if (scrollTop === 20000) {
    //           await stall(500);
    //           break;
    //         }
    //       }
    //       function stall (ms) {
    //         return new Promise(resolve => {
    //           setTimeout(() => {
    //             resolve();
    //           }, ms);
    //         });
    //       }
    //     });

    //     async function fetchManufacturerContentIframe (url) {
    //       await context.goto(url);
    //       return await context.evaluate(async function () {
    //         const manufacturerDescription = document.body.innerText;
    //         const manufacturerImagesList = document.querySelectorAll('body img');
    //         const manufacturerImageArray = [];

    //         for (let i = 0; i < manufacturerImagesList.length; i++) {
    //           const imgUrl = manufacturerImagesList[i].getAttribute('src');
    //           imgUrl && manufacturerImageArray.push(imgUrl);
    //         }

    //         return { manufacturerDescription, manufacturerImageArray };
    //       });
    //     }
    //     async function checkmanufacturerContent () {
    //       return await context.evaluate(async function () {
    //         const manufacturerIFrameSelector = document.evaluate('//div[@class="product-collateral"]//iframe', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    //         const manufacturerIFrameSrc = manufacturerIFrameSelector ? manufacturerIFrameSelector.src : '';
    //         if (manufacturerIFrameSrc) {
    //           return manufacturerIFrameSrc;
    //         } else {
    //           return false;
    //         }
    //       });
    //     }

    //     // Function to add manufacturer content and description to DOM
    //     async function addContentToDOM (manContentObj, manufacturerContentLink) {
    //       await context.evaluate(async function ([manContentObj, manufacturerContentLink]) {
    //         function addHiddenDiv (id, content) {
    //           const newDiv = document.createElement('div');
    //           newDiv.id = id;
    //           newDiv.textContent = content;
    //           newDiv.style.display = 'none';
    //           document.body.appendChild(newDiv);
    //         }
    //         if (manufacturerContentLink) {
    //           // Adding manufacturer images to DOM
    //           for (let i = 0; i < manContentObj.manufacturerImageArray.length; i++) {
    //             addHiddenDiv('added-manufacturer-images-' + i, manContentObj.manufacturerImageArray[i]);
    //           }
    //           addHiddenDiv('gtin', manContentObj.gtin);

    //           addHiddenDiv('added-manufacturer-description', manContentObj.manufacturerDescription);
    //         }
    //       }, [manContentObj, manufacturerContentLink]);
    //     }
    //     const pageUrl = await context.evaluate(async () => {
    //       return window.location.href;
    //     });

    //     console.log('pageUrl ==', pageUrl);
    //     const manufacturerContentLink = await checkmanufacturerContent();
    //     let manContentObj;
    //     if (manufacturerContentLink) {
    //       manContentObj = await fetchManufacturerContentIframe(manufacturerContentLink);
    //       await context.goto(pageUrl);
    //     }
    //     await addContentToDOM(manContentObj, manufacturerContentLink);

    await new Promise((resolve) => setTimeout(resolve, 5000));
    return await context.extract(productDetails, { transform });
  },
};
