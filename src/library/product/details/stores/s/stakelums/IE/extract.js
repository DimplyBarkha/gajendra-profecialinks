const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IE',
    store: 'stakelums',
    transform: cleanUp,
    domain: 'stakelums.ie',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    // Main Product Evaluate
    await context.evaluate(async function () {
      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };
      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };

      function addHiddenDiv(id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      function stall(ms) {
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
      }
      addHiddenDiv('added_variantCount', 0);
      const imageXpath = "//div[contains(@class,'fotorama')]//div[contains(@class,'fotorama__fade-rear')]//img/@src";
      const image = getXpath(imageXpath, 'nodeValue');
      addHiddenDiv('add_image', image);

      const imageAltXpath = "//div[contains(@class,'fotorama')]//div[contains(@class,'fotorama__fade-rear')]//img/@alt";
      const imageAlt = getXpath(imageAltXpath, 'nodeValue');
      addHiddenDiv('add_imageAlt', imageAlt);

      const availabilityXpath = '//meta[@itemprop="availability"]/@content';
      const availability = getXpath(availabilityXpath, 'nodeValue');
      if (availability.toString().includes('OutOfStock') > 0) {
        addHiddenDiv('add_availability', 'Out of Stock');
      } else {
        addHiddenDiv('add_availability', 'In Stock');
      }
      const specificationsXpath = "//table[@class='flix-std-specs-table']/tbody/tr/td";
      var specificationsStr = getAllXpath(specificationsXpath, 'innerText').join(' || ');
      // check Weight from Specification
      const weightSpecification = document.querySelectorAll('.inpage_selector_specification .flix-std-table .flix-std-specs-table .flix-title');
      let weight = '';
      weightSpecification.forEach((item) => {
        if (item.textContent.includes('kg')) {
          weight = item.textContent;
          addHiddenDiv('product_weight', weight);
        }
      });
      if (weight === '') {
        const shippingWeight = document.querySelectorAll('.inpage_selector_specification .flix-std-specs-table .flix-title');
        shippingWeight.forEach((item) => {
          if (item.textContent.includes('KG') || item.textContent.includes('kg')) {
            weight = item.textContent;
          }
        });
        if (weight !== '') {
          addHiddenDiv('product_weight', weight);
        }
      }
      if (weight === '') {
        const weightXpathOption3 = getXpath("//div[@id='prodShortDesc2']//p[contains(text(),'Weight')]", 'innerText');
        if (weightXpathOption3 !== null) {
          const weightData = weightXpathOption3.toString().trim().split(':');
          addHiddenDiv('product_weight', weightData[1]);
        }
      }
      // Video
      const videoUrlPath = getXpath("//div[@class='fullJwPlayerWarp']//input[@class='flix-jw']/@value", 'nodeValue');
      if (videoUrlPath && typeof videoUrlPath === 'string') {
        var videoUrlObj = JSON.parse(videoUrlPath);
        addHiddenDiv('added_video_url', 'http:' + videoUrlObj.playlist[0].file);
      }
      // warranty
      const warrantyXPath1 = getXpath("//div[@id='prodShortDesc2']//*[contains(text(),'guarantee') or contains(text(),'warranty')]", 'innerText');
      if (warrantyXPath1 !== null) {
        addHiddenDiv('added_warranty', warrantyXPath1);
      } else {
        let warrantyXPath2 = getXpath("//div[@id='prodShortDesc2']//p[contains(.,'guarantee')]", 'innerText');
        if (warrantyXPath2 !== null) {
          warrantyXPath2 = warrantyXPath2.toLowerCase();
          if (warrantyXPath2.includes('guarantee') && warrantyXPath2.includes('year')) {
            const warrantyXPath = warrantyXPath2.substring(warrantyXPath2.indexOf('year') - 3, warrantyXPath2.lastIndexOf('guarantee'));
            addHiddenDiv('added_warranty', warrantyXPath);
          }
        }
      }
      const productInformation = getAllXpath('//div[@id="prodShortDesc2"]/p', 'innerText');
      if (productInformation.length > 0) {
        const specificationOption2 = productInformation.join('||');
        addHiddenDiv('added_productInformation', productInformation.join('|'));

      }

      const inTheBoxUrlArr = [];
      findXpathArr("//div[@class='eky-accesory-container']/div[@class='eky-accessory']/img/@src|//div[@class='inpage_selector_InTheBox']//div[@class='flix-background-image']/img/@srcset").forEach(item => {
        console.log("inTheBoxUrl: ", item)
        const links = item.split(' ')[0];
        inTheBoxUrlArr.push(links);
      });
      addHiddenDiv('added_inTheBoxUrl', inTheBoxUrlArr.join(' || '));

      function findXpathArr(xpath) {
        const element = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
        let node = element.iterateNext();
        const value = [];
        while (node) {
          value.push(node.textContent);
          node = element.iterateNext();
        }
        return value;
      }

      let compareTable = document.querySelector('.inpage_selector_comparison > div');
      if (compareTable) {
        addHiddenDiv(`isCompareTable-`, 'Yes');
      }

    });

    const link = await context.evaluate(function () {
      return window.location.href;
    });

    const src = await context.evaluate(async function () {
      const iframe = document.querySelector('#eky-dyson-iframe');
      // const src = iframe ? (iframe.src||iframe._src) : '';
      let src = '';
      if (iframe) {
        if (iframe.hasAttribute('src')) {
          src = iframe.getAttribute('src');
        } else if (iframe.hasAttribute('_src')) {
          src = iframe.getAttribute('_src');
        } else {
          console.log('we do not have any src in iframe');
        }
      }

      return src;
    });
    // let content = null;
    if (src) {

      try {
        await context.goto(src, { timeout: 50000, waitUntil: 'load', checkBlocked: true });

        const witbData = await context.evaluate(async () => {
          const getInTheBox = document.querySelector('div.eky-accesory-container img');
          // const getInTheBoxWB = document.querySelector('div.inpage_selector_InTheBox');
          const getInTheBoxVideo = document.querySelector('div.eky-container-full');
          const inBoxUrls = [];
          const inBoxText = [];
          if (getInTheBoxVideo) {
            const getAllProductsVideo = document.querySelectorAll('div.tns-inner > div.my-slider>div.eky-relative-wrapper.tns-normal');
            for (let i = 0; i < getAllProductsVideo.length; i++) {
              inBoxUrls.push(getAllProductsVideo[i].querySelector('div.eky-header-video-container>video').getAttribute('src'));
              inBoxText.push(getAllProductsVideo[i].querySelector('div.eky-overlay>div.lax>h1').innerText);
            }
          }
          if (getInTheBox) {
            const getAllProducts = document.querySelectorAll('div.eky-accesory-container > div.eky-accessory');
            for (let i = 0; i < getAllProducts.length; i++) {
              inBoxUrls.push(getAllProducts[i].querySelector('img').getAttribute('src'));
              inBoxText.push(getAllProducts[i].querySelector('div').innerText);
            }
          }


          // if(getInTheBoxWB){
          //   const getAllProductsWB = document.querySelectorAll('div.inpage_selector_InTheBox>div.flix-std-container-fluid>div.flix-std-table>div.flix-box-modules>div.flix-std-table>div.flix-std-table-cell');
          //   for (let i = 0; i < getAllProductsWB.length; i++) {
          //     inBoxUrls.push(getAllProductsWB[i].querySelector('div.flix-background-image>img').getAttribute('data-flixsrcset'));
          //     inBoxText.push(getAllProductsWB[i].querySelector('div.flix-std-content>div.flix-std-desc>span').innerText);
          //   }
          // }
          return { inBoxText, inBoxUrls };
        });


        await context.goto(link, { timeout: 5000, waitUntil: 'load', checkBlocked: true });
        await context.waitForSelector('#inpage_container');

        await context.evaluate(async (witbData) => {


          function addHiddenDiv(id, content) {
            const newDiv = document.createElement('div');
            newDiv.id = id;
            newDiv.textContent = content;
            newDiv.style.display = 'none';
            document.body.appendChild(newDiv);
          }


          const { inBoxText = [], inBoxUrls = [] } = witbData;
          addHiddenDiv(`inTheBoxText-`, inBoxText.join(' || '));
          addHiddenDiv(`inTheBoxUrl-`, inBoxUrls.join(' || '));
          // for (let i = 0; i < inBoxUrls.length; i++) {
          //   addHiddenDiv(`inTheBoxUrl-${i}`, inBoxUrls[i]);
          //   // if (inBoxText[i]) {
          //   //   addHiddenDiv(`inTheBoxText-${i}`, inBoxText[i] );
          //   // }
          // }      
        }, witbData);

        await context.evaluate(async () => {


          function addHiddenDiv(id, content) {
            const newDiv = document.createElement('div');
            newDiv.id = id;
            newDiv.textContent = content;
            newDiv.style.display = 'none';
            document.body.appendChild(newDiv);
          }


          let compareTable = document.querySelector('.inpage_selector_comparison > div');
          if (compareTable) {
            addHiddenDiv(`isCompareTable-`, 'Yes');
          }
        });


        // await context.waitForSelector('div#main-section', { timeout: 45000 });
      } catch (error) {
        try {
          await context.evaluate(async function (src) {
            window.location.assign(src);
          }, src);
          await context.waitForSelector('div.eky-container-full');

        } catch (err) {
          console.log(err);
        }
      }
      // return await context.extract(productDetails, { transform });
    } else {
      console.log('we do not have the src for iframe');

    }

    await context.extract(productDetails, { transform: transformParam });
  },
};
