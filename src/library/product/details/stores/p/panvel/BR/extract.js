const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BR',
    store: 'panvel',
    transform: transform,
    domain: 'panvel.com',
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
      await context.waitForXPath('//div[@class="box-produto__content"]/a');
      await context.waitForSelector('div.box-produto__content a');
      console.log('everything fine !!!');
      await context.evaluate(() => {
        const firstItem = document.querySelector('div.box-produto__content a');
        firstItem.click();
      });
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop <= 20000) {
        await stall(500);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
          await stall(500);
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
    await context.evaluate(async () => {
      // const descNode = document.querySelector('div.product-info-description');
      let desc = '';
      const images = [];
      // if (descNode && descNode.innerText) {
      //   desc = descNode.innerText;
      //   desc = desc.replace(/\n{1,}"/g, ' ').replace(/\s{1,}"/g, ' ');
      // }
      try {
        const descNode1 = document.querySelector('div.syndi_powerpage');
        await new Promise(resolve => setTimeout(resolve, 2000));
        if (descNode1 && descNode1.shadowRoot) {
          const fetchNode = descNode1.shadowRoot.firstChild;
          const text = fetchNode.innerText;
          desc = desc + text;
          const manImages = fetchNode.querySelectorAll('img');
          if (manImages && manImages.length > 0) {
            for (let i = 0; i < manImages.length; i++) {
              images.push(manImages[i].src);
            }
          }
        }
      } catch (err) { }
      if (images.length > 0) {
        const image = images.join(' | ');
        addHiddenDiv('manuf-images', image);
      }
      if (desc.length > 0) {
        addHiddenDiv('product-desc', desc);
      }
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      return [`desc.length = ${desc}`, `images : ${images.length}`];
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
    // await context.evaluate(async function () {
    //   const desc = document.querySelector('div.syndi_powerpage');
    //   if (desc) {
    //     let text = desc.shadowRoot.firstChild.innerText;
    //     text = text.replace('/g\n\s{1,}/', '');
    //   }
    // })
    // }
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
        const manufacturerIFrameSelector = document.evaluate('//div[@id="standoutDiv"]//iframe', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
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

    await new Promise((resolve) => setTimeout(resolve, 5000));
    return await context.extract(productDetails, { transform });
  },
};
