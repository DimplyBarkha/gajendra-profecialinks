const { transform } = require('./format');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  console.log("inputs:: ", inputs);
  const {url, id } = inputs;
  console.log("parameters:: ", parameters);
  // try {
  //   await context.waitForSelector('div.owl-item.active img.owl-lazy');
  //   // await context.click('div.modal-footer>a.btn-success')
  //   // await context.click('div.modal-footer > button')
  // } catch (error) {
  //   console.log('cookie pop up not loded', error);
  // }
  if (id) {
    await new Promise((resolve, reject) => setTimeout(resolve, 10000));
    await context.waitForXPath('//div[@class="clear product-grid-view"]//a[@class="umbrella"]');

    await context.waitForSelector('div.row a.umbrella');
    console.log('everything fine !!!');
    await context.evaluate(() => {
      const firstItem = document.querySelector('div.row a.umbrella');
      firstItem.click();
    });
  }
  async function fetchManufacturerContentIframe (url) {
    await context.goto(url);
    return await context.evaluate(async function () {
      const manufacturerDescription = document.body.innerText;
      const manufacturerImagesList = document.querySelectorAll('div.box img');
      const manufacturerImageArray = [];
      let gtin = '';
      try {
        const gtinPath = '//strong[contains(text(),"EAN:")]/../following-sibling::td[1]';
        const gtinText = document.evaluate(gtinPath, document, null, XPathResult.STRING_TYPE, null).stringValue;
        if (gtinText) gtin = gtinText;
      } catch (err) { }
      for (let i = 0; i < manufacturerImagesList.length; i++) {
        const imgUrl = manufacturerImagesList[i].getAttribute('src');
        imgUrl && manufacturerImageArray.push(imgUrl);
      }
      return { manufacturerDescription, gtin, manufacturerImageArray };
    });
  }
  async function checkmanufacturerContent () {
    return await context.evaluate(async function () {
      const manufacturerIFrameSelector = document.evaluate('//div[@class="owl-custom-theme"]/iframe', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      const manufacturerIFrameSrc = manufacturerIFrameSelector ? manufacturerIFrameSelector.src : '';
      if (manufacturerIFrameSrc) {
        return manufacturerIFrameSrc;
      } else {
        return false;
      }
    });
  }

  // Function to add manufacturer content and description to DOM
  async function addContentToDOM (manContentObj, manufacturerContentLink) {
    await context.evaluate(async function ([manContentObj, manufacturerContentLink]) {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      if (manufacturerContentLink) {
        // Adding manufacturer images to DOM
        for (let i = 0; i < manContentObj.manufacturerImageArray.length; i++) {
          addHiddenDiv('added-manufacturer-images-' + i, manContentObj.manufacturerImageArray[i]);
        }
        addHiddenDiv('gtin', manContentObj.gtin);

        addHiddenDiv('added-manufacturer-description', manContentObj.manufacturerDescription);
      }
    }, [manContentObj, manufacturerContentLink]);
  }
  const pageUrl = await context.evaluate(async () => {
    return window.location.href;
  });

  console.log('pageUrl ==', pageUrl);
  const manufacturerContentLink = await checkmanufacturerContent();
  let manContentObj;
  if (manufacturerContentLink) {
    manContentObj = await fetchManufacturerContentIframe(manufacturerContentLink);
    await context.goto(pageUrl);
  }
  await addContentToDOM(manContentObj, manufacturerContentLink);

  await new Promise((resolve) => setTimeout(resolve, 5000))
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'plein',
    transform,
    domain: 'plein.nl',
    zipcode: '',
  },
  implementation,
};
// implementation: async (inputs,
//   parameters,
//   context,
//   dependencies,
// ) => {
//   await context.evaluate(async () => {
//     const loadMoreEle = document.querySelector('button.btn.btn-link.product-details-toggle');
//     if (loadMoreEle) {
//       // @ts-ignore
//       loadMoreEle.click();
//     }

//     let scrollTop = 0;
//     while (scrollTop !== 20000) {
//       await stall(500);
//       scrollTop += 1000;
//       window.scroll(0, scrollTop);
//       if (scrollTop === 20000) {
//         await stall(5000);
//         break;
//       }
//     }
//     function stall (ms) {
//       return new Promise((resolve, reject) => {
//         setTimeout(() => {
//           resolve();
//         }, ms);
//       });
//     }
//   });
//   const { transform } = parameters;
//   const { productDetails } = dependencies;
//   await context.extract(productDetails, { transform });
// },
