const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'bedbathbeyond',
    transform,
    domain: 'bedbathbeyond.com',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await new Promise(resolve => setTimeout(resolve, 2000));     
    //await new Promise(resolve => setTimeout(resolve, 2000));
    //await new Promise((resolve, reject) => setTimeout(resolve, 40000));
    try {
      await context.waitForXPath('//a[@class="HyperLink_6o9ywu ProductMediaCarouselStyle_3wTrlJ"]');
      await context.waitForSelector('a.HyperLink_6o9ywu.ProductMediaCarouselStyle_3wTrlJ span');
      console.log('everything fine !!!');
      await context.evaluate(() => {
        const firstItem = document.querySelector('a.HyperLink_6o9ywu.ProductMediaCarouselStyle_3wTrlJ span');
        firstItem.click();
      });   
    } catch (err) { }

    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop <= 20000) {
        await stall(500);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
          await stall(8000);
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

    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      await context.waitForXPath('//div[@class="ShowMore_761672 relative hideOnPrint"]/button');
      await context.waitForSelector('div.ShowMore_761672.relative.hideOnPrint > button');
      console.log('everything fine !!!');
      await context.evaluate(() => {
        const firstItem = document.querySelector('div.ShowMore_761672.relative.hideOnPrint > button');
        firstItem.click();
      });   
    } catch (err) { }
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
          desc = desc.replace(/\n{1,}"/g, ' ').replace(/\s{1,}"/g, ' ');
          const manImages = fetchNode.querySelectorAll('div.syndigo-featureset-feature img');
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
      return [`desc.length = ${desc.length}`, `images : ${images.length}`];
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await context.evaluate(async function () {
      const desc = document.querySelector('div.syndi_powerpage');
      if (desc) {
        let text = desc.shadowRoot.firstChild.innerText;
        text = text.replace('/g\n\s{1,}/', '');
      }
    });
    // await context.evaluate(async function () {
    //   const iframe = document.querySelector('');
    //   if (iframe) {
    //     const video = iframe.contentWindow.document.getElementsByTagName('video');
    //     const videoUrls = [...video].map(elm => elm.src);
    //     document.querySelector('head').setAttribute('video', videoUrls.join(''));
    //   }   else {
    //     const id = document.querySelector('#product-body-item-number') ? document.querySelector('#product-body-item-number').textContent.match(/(\d+)/g) : '';
    //     const url = `https://cors-anywhere.herokuapp.com/https://sc.liveclicker.net/service/api?method=liveclicker.widget.getList&account_id=69&dim5=${id}&format=json`;
    //     const data = await fetch(url);
    //     if (data.status === 200) {
    //       const json = await data.json();

    //       const arr = [];
    //       const array = json.widgets.widget;
    //       array.forEach(item => {
    //         const val = item.asset_id;
    //         const url = `https://d2vxgxvhgubbj8.cloudfront.net/videos/69/${val}_1_liveclicker.mp4`;
    //         arr.push(url);
    //       });
    //       let count = 0;
    //       arr.forEach(item => {
    //         document.querySelector('head').setAttribute(`vid${count}`, item);
    //         count++;
    //       });
    //     }
    //   }
    // }); 
    await new Promise((resolve) => setTimeout(resolve, 1000));
    async function fetchManufacturerContentIframe (url) {
      await context.goto(url);
      return await context.evaluate(async function () {
        const manufacturerDescription = document.body.innerText;
        const manufacturerImagesList = document.querySelectorAll('div.wc-aplus-body img');
        const manufacturerImageArray = [];
        let gtin = '';
        // try {
        //   const gtinPath = '//strong[contains(text(),"EAN:")]/../following-sibling::td[1]';
        //   const gtinText = document.evaluate(gtinPath, document, null, XPathResult.STRING_TYPE, null).stringValue;
        //   if (gtinText) gtin = gtinText;
        // } catch (err) { }
        for (let i = 0; i < manufacturerImagesList.length; i++) {
          const imgUrl = manufacturerImagesList[i].getAttribute('src');
          imgUrl && manufacturerImageArray.push(imgUrl);
        }

        return { manufacturerDescription, manufacturerImageArray };
      });
    }
    async function checkmanufacturerContent () {
      return await context.evaluate(async function () {
        const manufacturerIFrameSelector = document.evaluate('//div[@class="wc-aplus-body"]//iframe | //div[@class="wc-aplus-body"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
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

    await new Promise((resolve) => setTimeout(resolve, 2000));
    return await context.extract(productDetails, { transform });  
  },
};
