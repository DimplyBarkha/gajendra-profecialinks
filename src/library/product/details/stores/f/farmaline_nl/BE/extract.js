const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BE',
    store: 'farmaline_nl',
    transform: transform,
    domain: 'farmaline.be',
    zipcode: '',
  },
  // implementation: async (inputs,
  //   parameters,
  //   context,
  //   dependencies,
  // ) => {
  //   const { transform } = parameters;
  //   const { productDetails } = dependencies;
  //   // const { url, id } = inputs;

  //   await new Promise(resolve => setTimeout(resolve, 2000));
  //   // await context.evaluate(async function () {
  //   //   const desc = document.querySelector('div.syndi_powerpage');
  //   //   if (desc) {
  //   //     let text = desc.shadowRoot.firstChild.innerText;
  //   //     text = text.replace('/g\n\s{1,}/', '');
  //   //   }
  //   // })
  //   // }
  //   async function fetchManufacturerContentIframe (url) {
  //     await context.goto(url);
  //     return await context.evaluate(async function () {
  //       const manufacturerDescription = document.body.innerText;
  //       const manufacturerImagesList = document.querySelectorAll('section.product-detail-content-grid iframe');
  //       const manufacturerImageArray = [];
  //       for (let i = 0; i < manufacturerImagesList.length; i++) {
  //         const imgUrl = manufacturerImagesList[i].getAttribute('src');
  //         imgUrl && manufacturerImageArray.push(imgUrl);
  //       }
  //       return { manufacturerDescription, manufacturerImageArray };
  //     });
  //   }
  //   async function checkmanufacturerContent () {
  //     return await context.evaluate(async function () {
  //       const manufacturerIFrameSelector = document.evaluate('//section[contains(@class,"product-detail-content-grid")]//iframe', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  //       const manufacturerIFrameSrc = manufacturerIFrameSelector ? manufacturerIFrameSelector.src : '';
  //       if (manufacturerIFrameSrc) {
  //         return manufacturerIFrameSrc;
  //       } else {
  //         return false;
  //       }
  //     });
  //   }

  //   // Function to add manufacturer content and description to DOM
  //   async function addContentToDOM (manContentObj, manufacturerContentLink) {
  //     await context.evaluate(async function ([manContentObj, manufacturerContentLink]) {
  //       function addHiddenDiv (id, content) {
  //         const newDiv = document.createElement('div');
  //         newDiv.id = id;
  //         newDiv.textContent = content;
  //         newDiv.style.display = 'none';
  //         document.body.appendChild(newDiv);
  //       }
  //       if (manufacturerContentLink) {
  //         // Adding manufacturer images to DOM
  //         for (let i = 0; i < manContentObj.manufacturerImageArray.length; i++) {
  //           addHiddenDiv('added-manufacturer-images-' + i, manContentObj.manufacturerImageArray[i]);
  //         }

  //         addHiddenDiv('added-manufacturer-description', manContentObj.manufacturerDescription);
  //       }
  //     }, [manContentObj, manufacturerContentLink]);
  //   }
  //   const pageUrl = await context.evaluate(async () => {
  //     return window.location.href;
  //   });

  //   console.log('pageUrl ==', pageUrl);
  //   const manufacturerContentLink = await checkmanufacturerContent();
  //   let manContentObj;
  //   if (manufacturerContentLink) {
  //     manContentObj = await fetchManufacturerContentIframe(manufacturerContentLink);
  //     await context.goto(pageUrl);
  //   }
  //   await addContentToDOM(manContentObj, manufacturerContentLink);

  //   await new Promise((resolve) => setTimeout(resolve, 5000));
  //   return await context.extract(productDetails, { transform });
  // },
};
