const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'bedbathandbeyond',
    transform,
    domain: 'bedbathandbeyond.com',
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
    // await new Promise(resolve => setTimeout(resolve, 2000));
    // await new Promise((resolve, reject) => setTimeout(resolve, 40000));

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
    // try {
    //   await context.waitForXPath('//div[contains(@class, "ShowMore")][contains(@class, "relative hideOnPrint")]/button', { timeout: 15000 });
    //   await context.waitForSelector('div[class^="ShowMore"].relative.hideOnPrint > button', { timeout: 2000 });
    //   console.log('everything fine !!!');
    //   await context.click('div[class^="ShowMore"].relative.hideOnPrint > button');
    //   // await context.evaluate(() => {
    //   //   const firstItem = document.querySelector('div[class^="ShowMore"].relative.hideOnPrint > button');
    //   //   firstItem.click();
    //   // });
    // } catch (err) { }
    await context.evaluate(function () {
      if (document.querySelector('div[role="dialog"] button[title="close"]')) {
        document.querySelector('div[role="dialog"] button[title="close"]').click();
      }
    });
    try {
      await context.waitForXPath('//div[contains(@class, "ShowMore")][contains(@class, "relative hideOnPrint")]/button', { timeout: 15000 });
      await context.waitForSelector('div[class^="ShowMore"].relative.hideOnPrint > button', { timeout: 2000 });
      console.log('everything fine !!!');
      await context.click('div[class^="ShowMore"].relative.hideOnPrint > button');
      // await context.evaluate(() => {
      //   const firstItem = document.querySelector('div[class^="ShowMore"].relative.hideOnPrint > button');
      //   firstItem.click();
      // });
    } catch (err) { }
    async function scrollToRec (node) {
      await context.evaluate(async (node) => {
        const element = document.querySelector(node) || null;
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
          await new Promise((resolve) => {
            setTimeout(resolve, 5000);
          });
        }
      }, node);
    }
    await scrollToRec('footer');
    await scrollToRec('div#productDetails');
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
        addHiddenDiv('ii_manufContent', desc);
      }
      // function isVisible( elem ) {
      //   return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
      // }
      let moreManufContent = '';
      let manufImg = '';
      let manufVideoText = '';
      if (document.querySelector('iframe[id^="wcframable"') && document.querySelector('iframe[id^="wcframable"').contentWindow && document.querySelector('iframe[id^="wcframable"').contentWindow.document.querySelector('body')) {
        const arrManuf = [];
        const arrManufImg = [];
        const arrManufVideos = [];
        [...document.querySelectorAll('iframe[id^="wcframable"')].forEach(el => {
          if (el.contentWindow) {
            const iframeWindow = el.contentWindow;
            if (iframeWindow.document.querySelector('body') && !(iframeWindow.document.querySelector('body').innerText.includes('Play Video'))) {
              arrManuf.push(iframeWindow.document.querySelector('body').innerText.replace(/(\s*\n\s*)+/g, ' ').replace(/\n/g, ' '));
            }

            if (iframeWindow.document.querySelectorAll('video').length) {
              [...iframeWindow.document.querySelectorAll('video')].forEach(video => {
                arrManufVideos.push(video.src);
              });
            }

            if (iframeWindow.document.querySelectorAll('img').length) {
              [...iframeWindow.document.querySelectorAll('img')].forEach(img => {
                const imgSrc = img.src.replace(/(?<=.jpeg).*|(?<=.jpg).*/g, '');
                if (arrManufImg.indexOf(imgSrc) === -1) {
                  arrManufImg.push(imgSrc);
                }
              });
            }
          }
        });
        moreManufContent = Array.from(new Set(arrManuf)).join(' | ');
        console.log('moreManufContent kljkjlkl');
        console.log(moreManufContent);
        moreManufContent = moreManufContent.trim();
        if (moreManufContent.endsWith('|')) {
          console.log('moreManufContent fdfd');
          console.log(moreManufContent);
          moreManufContent = moreManufContent.slice(0, -1);
        }
        manufImg = Array.from(new Set(arrManufImg)).join(' | ');
        manufVideoText = Array.from(new Set(arrManufVideos)).join(' | ');
      }
      const hiddenVideosInImg = document.querySelectorAll('img.wc-video');
      if (hiddenVideosInImg.length) {
        if (manufVideoText.length) {
          manufVideoText += ' | ';
        }
        const hiddenVideosInImgArr = [];
        [...hiddenVideosInImg].forEach(video => {
          if (video.getAttribute('data-asset-url')) {
            hiddenVideosInImgArr.push(video.src.replace(/(?<=_cp).*/g, video.getAttribute('data-asset-url')));
          }
        });
        manufVideoText += hiddenVideosInImgArr.join(' | ');
      }
      if (moreManufContent.length > 0) {
        addHiddenDiv('ii_manufContent', moreManufContent);
      }
      if (manufImg.length > 0) {
        addHiddenDiv('ii_manufImg', manufImg);
      }
      if (manufVideoText.length > 0) {
        addHiddenDiv('ii_manufVid', manufVideoText);
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
        const gtin = '';
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

    try {
      // await context.waitForXPath('//a[contains(@class,"ProductMediaCarouselStyle")]');
      await context.waitForSelector('a[class^="ProductMediaCarouselStyle"] span, div[class^="ProductMediaCarouselStyle"] a', { timeout: 35000 });
      console.log('everything fine !!!');
      await context.evaluate(function () {
        const firstItem = document.querySelector('a[class^="ProductMediaCarouselStyle"] span, div[class^="ProductMediaCarouselStyle"] a');
        firstItem.click();
        function addHiddenDiv (id, content) {
          const newDiv = document.createElement('div');
          newDiv.id = id;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
        }
        const videosInMain = document.querySelectorAll('ul[class^="ProductMediaCarouselStyle"] > li > button > img[alt="Video"][src*=".jp"]');
        if (videosInMain.length) {
          [...videosInMain].forEach((ele) => {
            ele.click();
            const tvPlayerVid = document.querySelector('div[class^="ProductMediaCarouselStyle"] iframe');
            if (tvPlayerVid) {
              addHiddenDiv('ii_manufVid', tvPlayerVid.getAttribute('src'));
            }
          });
        }
      });
    } catch (err) { }

    await new Promise((resolve) => setTimeout(resolve, 2000));
    let variantsButtonChange = await context.evaluate(async function () {
      return document.querySelectorAll('div[itemtype="http://schema.org/Product"] div[name*="_swatches"] div.rclCustomSelectListWrapper ul[aria-label="options"] li[class^="rclCustomItem"] button').length;
    });
    const variantsSizeChange = await context.evaluate(async function () {
      return document.querySelectorAll('div[itemtype="http://schema.org/Product"] div[name*="sizeSelect"] div.rclCustomSelectListWrapper ul[aria-label="options"] li[class^="rclCustomItem"] button').length;
    });
    const variantsButtonSizeChange = await context.evaluate(async function () {
      return document.querySelectorAll('div[itemtype="http://schema.org/Product"] div[name*="_swatches"] div.rclCustomSelectListWrapper ul[aria-label="options"] li[class^="rclCustomItem"] button, div[itemtype="http://schema.org/Product"] div[name*="sizeSelect"] div.rclCustomSelectListWrapper ul[aria-label="options"] li[class^="rclCustomItem"] button').length;
    });
    console.log('variantsButtonChange fddf');
    console.log(variantsButtonChange);

    variantsButtonChange = variantsButtonChange >= 10 ? 10 : variantsButtonChange;

    try {
      // await context.waitForXPath('//a[contains(@class,"ProductMediaCarouselStyle")]');
      await context.waitForSelector('div[itemtype="http://schema.org/Product"] div[name*="_swatches"] div.rclCustomSelectListWrapper ul[aria-label="options"] li[class^="rclCustomItem"]button', { timeout: 15000 });
      console.log('everything fine !!!');
    } catch (err) { }

    if (variantsSizeChange !== 0) {
      for (let i = 1; i <= variantsButtonChange; i++) {
        await context.evaluate(() => {
          if (document.querySelector('div[role="dialog"] button[title="close"]')) {
            document.querySelector('div[role="dialog"] button[title="close"]').click();
          }
        });
        await context.click(`div[itemtype="http://schema.org/Product"] div[name*="_swatches"] div.rclCustomSelectListWrapper ul[aria-label="options"] li[class^="rclCustomItem"]:nth-child(${i}) button`);
        await new Promise((resolve) => setTimeout(resolve, 5000));
        const sizeOptions = await context.evaluate(() => {
          return document.querySelectorAll('div[itemtype="http://schema.org/Product"] div[name*="sizeSelect"] div.rclCustomSelectListWrapper ul[aria-label="options"] li button:not([disabled])').length;
        });
        for (let j = 0; j <= sizeOptions; j++) {
          await context.evaluate(() => {
            if (document.querySelector('div[role="dialog"] button[title="close"]')) {
              document.querySelector('div[role="dialog"] button[title="close"]').click();
            }
          });
          await context.click('button.rclCustomSelectBtn');
          // await context.click(`div[itemtype="http://schema.org/Product"] div[name*="sizeSelect"] div.rclCustomSelectListWrapper ul[aria-label="options"] li[class^="rclCustomItem"]:nth-child(${j}) button:not([disabled])`);

          await context.evaluate(async function (j) {
            if (document.querySelectorAll('div[itemtype="http://schema.org/Product"] div[name*="sizeSelect"] div.rclCustomSelectListWrapper ul[aria-label="options"] li button:not([disabled])')[j]) {
              document.querySelectorAll('div[itemtype="http://schema.org/Product"] div[name*="sizeSelect"] div.rclCustomSelectListWrapper ul[aria-label="options"] li button:not([disabled])')[j].click();
            }
          }, j);
          await new Promise((resolve) => setTimeout(resolve, 5000));

          try {
            // await context.waitForXPath('//a[contains(@class,"ProductMediaCarouselStyle")]');
            await context.waitForSelector('a[class^="ProductMediaCarouselStyle"] span, div[class^="ProductMediaCarouselStyle"] a', { timeout: 35000 });
            console.log('everything fine !!!');
            await context.evaluate(() => {
              const firstItem = document.querySelector('a[class^="ProductMediaCarouselStyle"] span, div[class^="ProductMediaCarouselStyle"] a');
              firstItem.click();
            });
          } catch (err) { }
          await context.extract(productDetails, { transform });
        }

        const linkURL = await context.evaluate(function () {
          const element = document.querySelector('meta[property="og:url"]');
          if (element) {
            return element.content;
          } else {
            return null;
          }
        });
        console.log(linkURL);
        if (linkURL) {
          await context.goto(linkURL);
        }
      }
    } else if (variantsButtonChange !== 0) {
      for (let i = 1; i <= variantsButtonChange; i++) {
        await context.evaluate(() => {
          if (document.querySelector('div[role="dialog"] button[title="close"]')) {
            document.querySelector('div[role="dialog"] button[title="close"]').click();
            if (document.querySelector('div#sizeSelect')) {
              document.querySelector('button.rclCustomSelectBtn').click();
              document.querySelector('ul.rclCustomSelectList li[aria-selected="true"]');
            }
          }
        });
        await context.click(`div[itemtype="http://schema.org/Product"] div[name*="_swatches"] div.rclCustomSelectListWrapper ul[aria-label="options"] li[class^="rclCustomItem"]:nth-child(${i}) button`);
        await new Promise((resolve) => setTimeout(resolve, 5000));

        try {
          // await context.waitForXPath('//a[contains(@class,"ProductMediaCarouselStyle")]');
          await context.waitForSelector('a[class^="ProductMediaCarouselStyle"] span, div[class^="ProductMediaCarouselStyle"] a', { timeout: 35000 });
          console.log('everything fine !!!');
          await context.evaluate(() => {
            const firstItem = document.querySelector('a[class^="ProductMediaCarouselStyle"] span, div[class^="ProductMediaCarouselStyle"] a');
            firstItem.click();
          });
        } catch (err) { }
        await context.extract(productDetails, { transform });
      }
    } else {
      return await context.extract(productDetails, { transform });
    }
    // return await context.extract(productDetails, { transform });
  },
};
