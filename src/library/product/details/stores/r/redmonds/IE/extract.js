/* eslint-disable camelcase */
// @ts-ignore
const { transform } = require('../../../../shared');
const { transform1 } = require('../format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IE',
    store: 'redmonds',
    transform: transform,
    transform1,
    domain: 'redmondelectric.ie',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, store, transform: transformParam }, context, { productDetails }) => {
    // Add Scroll for the images | Start - 26|11|2020
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 30000) {
          await stall(500);
          scrollTop += 1000;
          window.scroll(0, scrollTop);
          if (scrollTop === 30000) {
            await stall(6000);
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
    // Add Scroll for the images | End - 26|11|2020

    // const sectionsDiv = 'div.inpage_selector_specification table[class="flix-std-specs-table"]';
    // await context.waitForSelector(sectionsDiv, { timeout: 9000 });
    // async function scrollToRec (node) {
    //   await context.evaluate(async (node) => {
    //     const element = document.querySelector(node) || null;
    //     if (element) {
    //       element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    //       await new Promise((resolve) => {
    //         setTimeout(resolve, 5000);
    //       });
    //     }
    //   }, node);
    // }
    // await scrollToRec('div.footer-container, div,block-footer-bottom');
    await context.evaluate(async function () {
      // Add Here
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      // Method to Retrieve Xpath content of a Single Node
      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };

      // Method to Retrieve Xpath content of a Multiple Nodes
      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };

      addElementToDocument('added_variantcount', 0);
      // const description = getAllXpath("//div[@class='product-shop-content']//div[@class='short-description']//p[position() > 1]/strong | //div[@class='product-shop-content']//div[@class='short-description']//p[position() > 1]/strong/text()","innerText").join(' ');
      const description = getAllXpath("//div[@class='product-collateral']//div[@class='std']//p | //div[@class='product-collateral']//div[@class='std']//h4 | //div[@class='product-collateral']//div[@class='std']//h3", 'innerText').join(' ');
      // console.log(description);
      if (description) {
        addElementToDocument('added_description', description);
      }

      const dimensionsLength = getXpath("//div[@class='inpage_selector_specification']//table[contains(@class,'flix-std-specs-table')]//tbody//td//span[normalize-space(text())='Length']/parent::div/following-sibling::div/span", 'innerText');
      const dimensionsWidth = getXpath("//div[@class='inpage_selector_specification']//table[contains(@class,'flix-std-specs-table')]//tbody//td//span[normalize-space(text())='Width']/parent::div/following-sibling::div/span", 'innerText');
      const dimensionsHeight = getXpath("//div[@class='inpage_selector_specification']//table[contains(@class,'flix-std-specs-table')]//tbody//td//span[normalize-space(text())='Height']/parent::div/following-sibling::div/span", 'innerText');
      if (dimensionsLength != null && dimensionsWidth != null && dimensionsHeight != null) {
        var shippingDimensions = dimensionsLength + ' X ' + dimensionsWidth + ' X ' + dimensionsHeight;
        addElementToDocument('added_shippingdimensions', shippingDimensions);
      }

      const specifications = getAllXpath("//table[@class='flix-std-specs-table']//tbody//tr//td", 'innerText').join(' || ');
      if (specifications) {
        addElementToDocument('added_specifications', specifications);
      }

      const inTheBoxUrl = getAllXpath("//div[@class='product-collateral']//div[@class='inpage_selector_InTheBox']//img/@srcset", 'nodeValue');
      var inTheBoxVal = '';
      if (inTheBoxUrl.length > 0) {
        for (var inTheBox in inTheBoxUrl) {
          // @ts-ignore
          if (isNaN(inTheBox) === false) {
            inTheBoxVal += 'https:' + inTheBoxUrl[inTheBox] + '||';
          }
        }

        if (inTheBoxVal !== '') {
          inTheBoxVal = inTheBoxVal.replace(/||\s*$/, '');
          addElementToDocument('added_intheboxurl', inTheBoxVal);
        }
      }

      const inTheBoxText = getAllXpath("//div[@class='product-collateral']//div[@class='inpage_selector_InTheBox']//div[@class='flix-std-content']/div/span", 'innerText').join(' || ');
      if (inTheBoxText) {
        addElementToDocument('added_intheboxtext', inTheBoxText);
      }

      const enhanced_content = getAllXpath("//div[@class='flix-std-container-fluid']//div[@class='flix-std-row']//div", 'innerText').join(' ');
      if (enhanced_content) {
        addElementToDocument('added_enhanced_content', enhanced_content);
      }

      const aplus_images = getAllXpath("//div[@class='flix-std-container-fluid']//div[@class='flix-std-row']//div//img/@srcset", 'nodeValue');
      console.log(aplus_images);
      if (aplus_images) {
        var aplusImages = [];
        for (let i = 0; i < aplus_images.length; i++) {
          var img = 'https:' + aplus_images[i];
          aplusImages.push(img);
        }
        addElementToDocument('added_aplus_images', aplusImages.join('|'));
      }
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      let scrollTop = 500;
      while (true) {
        window.scroll(0, scrollTop);
        await stall(1000);
        scrollTop += 500;
        if (scrollTop === 10000) {
          break;
        }
      };
    });

    const enhanced_content = await context.evaluate(async function () {
      return document.evaluate("//div[@class='flix-std-container-fluid']//div[@class='flix-std-row']//div", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
    });

    const iframeEnhancedContent = await context.evaluate(async function () {
      return document.querySelector('div.eky-container-limited iframe#eky-dyson-iframe') ? document.querySelector('div.eky-container-limited iframe#eky-dyson-iframe').src : null;
    });

    if (enhanced_content === 0 && iframeEnhancedContent) {
      const link = await context.evaluate(async function () {
        return window.location.href;
      });
      console.log(iframeEnhancedContent)
      const apiManufCall = iframeEnhancedContent;
      let content = null;
      let inBoxText = null;
      let inBoxUrls = null;
      await context.goto(apiManufCall, {
        timeout: 100000,
        waitUntil: 'load',
      });
      try {
        await context.waitForSelector('div.more, .preview-more a', { timeout: 15000 });
        await context.click('div.more, .preview-more a');
      } catch (error) {
        console.log('No preview button');
      }
      await context.evaluate(async () => {
        await new Promise((resolve) => setTimeout(resolve, 5000));

        async function infiniteScroll () {
          let prevScroll = document.documentElement.scrollTop;
          while (true) {
            window.scrollBy(0, document.documentElement.clientHeight);
            await new Promise(resolve => setTimeout(resolve, 1000));
            const currentScroll = document.documentElement.scrollTop;
            if (currentScroll === prevScroll) {
              break;
            }
            prevScroll = currentScroll;
          }
        }
        await infiniteScroll();
      });
      const text = await context.evaluate(async function () {
        return document.querySelector('body').innerText;
      });
      const inTheBoxData = await context.evaluate(async function () {
        let inBoxUrls = [];
        let inBoxText = [];
        const getAllProducts = document.querySelectorAll('div.eky-accessory');
        for (let i = 0; i < getAllProducts.length; i++) {
          inBoxUrls.push('https://media.flixfacts.com/eyekandy/dyson/v11/en/'+getAllProducts[i].querySelector('img').getAttribute('src'));
          inBoxText.push(getAllProducts[i].querySelector('div.eky-accesory-title').innerText);
        }
        inBoxUrls = inBoxUrls.join(' | ');
        inBoxText = inBoxText.join(' | ');
        return { inBoxText, inBoxUrls };
      });
      console.log('inthe box!!');
      console.log(inTheBoxData)

      // const comparisionText = await this.context.evaluate(async function (comparisionTableSelector) {
      //   return (!!document.querySelector(comparisionTableSelector) && document.querySelector(comparisionTableSelector).offsetHeight > 0 && document.querySelector(comparisionTableSelector).offsetWidth) > 0;
      // }, comparisionTableSelector);
      console.log(inBoxText);
      content = text;

      // await this.context.waitForSelector(imgSelector, { timeout: 300000 });
      const aplusImages = await context.evaluate(async function () {
        const images = document.querySelectorAll('img');
        const backImgs = [...document.querySelectorAll('*[style*="background-image"]')];
        const src = [];
        let srcUnique = [];
        if (backImgs) {
          backImgs.forEach(img => {
            let link = img.getAttribute('style').replace(/(.+\()(.+)(\))(.+)?/, '$2');
            if (link.includes('"')) {
              link = link.replace(/"/g, '');
            }
            src.push(link);
          });
          srcUnique = [...new Set(src)];
        }
        const imagesSrc = [];
        [...images].forEach((element) => {
          imagesSrc.push(element.getAttribute('src'));
        });
        if (srcUnique.length >= 1) {
          srcUnique.forEach(src => {
            imagesSrc.push(src);
          });
        }
        const allImages = [];
        for (let i = 0; i < imagesSrc.length; i++) {
          if (imagesSrc[i] === '' || imagesSrc[i] === null) {
            continue;
          } else {
            if (imagesSrc[i].startsWith('images/')) {
              allImages.push('https://media.flixfacts.com/eyekandy/dyson/v11/en/'+imagesSrc[i]);
            } else {
              allImages.push(imagesSrc[i]);
            }
          }
        }
        return allImages;
      });
      const video = await context.evaluate(async function () {
        const videosElements = document.querySelectorAll('video');
        const videoSrc = [];
        [...videosElements].forEach((element) => {
          if (element.getAttribute('src')) {
            videoSrc.push('https://media.flixfacts.com/eyekandy/dyson/v11/en/'+element.getAttribute('src').toString());
          }
        });
        const videosArr = Array.from(new Set(videoSrc));
        console.log('dsdsds videosdsd')
        console.log(videosArr)
        return videosArr.join(' || ');
      });
      console.log('dsdsds video 212')
      console.log(video)

      const specs = await context.evaluate(async function () {
        const specArr = [];
        const allSpecifications = document.querySelectorAll('div#specifications div.eky-specs-col');
        for (let i = 0; i < allSpecifications.length; i++) {
          specArr.push(allSpecifications[i].innerText);
        }
        return specArr.join(' || ');
      });

      await context.goto(link);
      await context.evaluate(async function (inTheBoxData, content, aplusImages, video, specs) {
        function addElementToDocument (key, value) {
          const catElement = document.createElement('div');
          catElement.id = key;
          catElement.textContent = value;
          catElement.style.display = 'none';
          document.body.appendChild(catElement);
        }
        addElementToDocument('added_intheboxurl', inTheBoxData.inBoxUrls);
        addElementToDocument('added_intheboxtext', inTheBoxData.inBoxText);
        addElementToDocument('added_aplus_images', aplusImages.join(' | '));
        addElementToDocument('added_videos', video);
        addElementToDocument('added_specifications', specs);
        addElementToDocument('added_enhanced_content', content);
      }, inTheBoxData, content, aplusImages, video, specs);
    }

    return await context.extract(productDetails, { transform: transformParam });
  },
};
