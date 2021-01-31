const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IE',
    store: 'soundstore',
    transform,
    domain: 'soundstore.ie',
    zipcode: '',
  },

  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    // enhanced content
    const delay = t => new Promise(resolve => setTimeout(resolve, t));
    const checkExistance = async (selector) => {
      try {
        await context.waitForSelector(selector);
      } catch (err) {
        console.log(selector, 'not present');
      }
      return await context.evaluate(async (currentSelector) => {
        return await Boolean(document.querySelector(currentSelector));
      }, selector);
    };
    const currentUrl = await context.evaluate(() => {
      return document.querySelector('meta[property="og:url"]').getAttribute('content');
    });
    const iframeSelector = '.eky-container-limited>iframe';
    if (await checkExistance(iframeSelector)) {
      const iframeUrl = await context.evaluate((iframeSelector) => {
        return document.querySelector(iframeSelector).getAttribute('src');
      }, iframeSelector);
      await context.goto(iframeUrl, { timeout: 50000, waitUntil: 'networkidle0', checkBlocked: true });
      await context.waitForXPath('//video');
      await context.waitForSelector('div[class="eky-row left-padding divider-line"] img');
      const video = await context.evaluate(() => {
        const src = ele('video');
        function ele (tag) {
          return document.querySelectorAll(tag);
        }
        let value = [];
        retrieve(src);
        function retrieve (src) {
          for (let i = 0; i < src.length; i++) {
            value.push(src[i].currentSrc);
          }
        }
        value = [...new Set(value)];
        return value;
      });

      await context.evaluate(() => {
        const scrollTo = document.querySelector('#specifications');
        scrollTo.scrollIntoView({ behavior: 'smooth' });
      });
      await context.waitForSelector('div[class="eky-row left-padding divider-line"] img');
      await delay(15000);
      const images = await context.evaluate(() => {
        const src = document.querySelectorAll('div[class="eky-row left-padding divider-line"] img');
        let value = [];
        retrieve(src);
        function retrieve (src) {
          for (let i = 0; i < src.length; i++) {
            value.push(src[i].currentSrc);
          }
        }
        value = [...new Set(value)];
        return value;
      });

      const specificationText = await context.evaluate(() => {
        const text = document.querySelectorAll('div.eky-specs-container p');
        const value = [];
        retrieve(text);
        function retrieve (text) {
          for (let i = 0; i < text.length; i++) {
            value.push(text[i].innerText);
          }
        }
        return value;
      });

      const desc = await context.evaluate(() => {
        const src = document.querySelectorAll('h1,h2,h3,h4,p,div.eky-accessory>div');
        const value = [];
        retrieve(src);
        function retrieve (src) {
          for (let i = 0; i < src.length; i++) {
            value.push(src[i].innerText);
          }
        }
        return value;
      });

      const inTheboxText = await context.evaluate(() => {
        let src = document.querySelectorAll('div.eky-accessory>div,div.tns-inner h1.eky-smaller');
        const value = [];
        retrieve(src);
        function retrieve (src) {
          for (let i = 0; i < src.length; i++) {
            value.push(src[i].innerText);
          }
        }
        return value;
      });

      const inTheboxUrls = await context.evaluate(() => {
        let urls = document.querySelectorAll('div.eky-accessory>img,div.tns-inner video');
        const value = [];
        retrieve(urls);
        function retrieve (urls) {
          for (let i = 0; i < urls.length; i++) {
            value.push(urls[i].src);
          }
        }
        return value;
      });


      await context.goto(currentUrl, { timeout: 50000, waitUntil: 'load', checkBlocked: true });
      await context.evaluate((video) => {
        video = video.join(' | ');
        document.querySelector('body').setAttribute('video-src', video);
      }, video);
      await context.evaluate((images) => {
        images = images.join(' | ');
        console.log(images);
        const len = images.length;
        if (images[len - 2] === '|') {
          console.log('removing | ');
          images = images.slice(0, len - 3);
        }
        document.querySelector('body').setAttribute('img-src', images);
      }, images);
      await context.evaluate((desc) => {
        desc = desc.join(' ');
        document.querySelector('body').setAttribute('desc', desc);
      }, desc);

      await context.evaluate((specificationText) => {
        specificationText = specificationText.join('||')
        document.querySelector('body').setAttribute('added_specifications', specificationText);
      }, specificationText);

      await context.evaluate((inTheboxText) => {
        inTheboxText = inTheboxText.join(' || ')
        document.querySelector('body').setAttribute('added_inTheboxText', inTheboxText);
      }, inTheboxText);

      await context.evaluate((inTheboxUrls) => {
        inTheboxUrls = inTheboxUrls.join(' || ')
        document.querySelector('body').setAttribute('added_inTheboxUrl', inTheboxUrls);
      }, inTheboxUrls);
    }

    await context.evaluate(async function (inTheboxUrl) {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };

      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };

      // document.getElementById('more-information').classList.remove('closed');

      // additional Bullet info & additional Bullet info count
      const addDescBulletInfoXpath1 = getAllXpath("//div[@class='product-info-main']//div[@class='value' and @itemprop='description']//ul//li", 'innerText');
      const addDescBulletInfoXpath2 = getAllXpath("//article[@id='details']//div[@class='value']//ul//li", 'innerText');
      var addDescBulletInfoList = addDescBulletInfoXpath1.concat(addDescBulletInfoXpath2);
      addElementToDocument('added_additionalDescBulletInfo', addDescBulletInfoList.join(' || '));
      addElementToDocument('added_additionalDescBulletInfoCount', addDescBulletInfoList.length);

      // product other iformation
      const productOtherInfoXpath = getAllXpath("//div//table[contains(@class,'additional-attributes')][2]//tbody/tr", 'innerText');
      var prodOtherInfo = productOtherInfoXpath.join(' | ');
      addElementToDocument('added_prodOtherInfo', prodOtherInfo);

      // addtional Description
      const additionalDescXpath = getXpath("//div[@class='main-col expandable-detailed-content']//div[@class='value']", 'innerText');
      var additionalDescInfoList = addDescBulletInfoXpath1.join(' || ');
      var additionalDescInfo = additionalDescInfoList + ' $$ ' + additionalDescXpath;

      additionalDescInfo.split('$$').forEach((item) => {
        // console.log(item);
        addElementToDocument('added_additionalDesc', item);
      });

      addElementToDocument('added_productsPerPage', 0);

      let scrollTop = 500;
      while (true) {
        window.scroll(0, scrollTop);
        await stall(1000);
        scrollTop += 500;
        if (scrollTop === 10000) {
          break;
        }
      }

      // Manufacture Description
      const manufacturerDescriptionXpathOption = getAllXpath("//div[contains(@id,'inpage_container')]//div[(contains(@class,'flix-d-p') or contains(@class,'flix-std-desc')) and not(contains(@class,'flix-title')or contains(@class,'flix-caveat-desc'))]", 'innerText');
      if (manufacturerDescriptionXpathOption.length > 0) {
        addElementToDocument('added_manufacturerDescription', manufacturerDescriptionXpathOption);
      }

      // const manufacturerImagesXpathOption = getAllXpath("//div[@class='flix-std-row']//img/@srcset | //div[contains(@class,'inpage_block')]//img/@srcset", 'nodeValue');
      // console.log(manufacturerImagesXpathOption);
      // if (manufacturerImagesXpathOption.length > 0) {
      //   addElementToDocument('added_manufacturerImages', manufacturerImagesXpathOption);
      // }
      // added videoUrls
      const videoUrlPath = getXpath("//div[@class='fullJwPlayerWarp']//input[@class='flix-jw']/@value", 'nodeValue');
      if (videoUrlPath && typeof videoUrlPath === 'string') {
        var videoUrlObj = JSON.parse(videoUrlPath);
        addElementToDocument('added_video_url', 'http:' + videoUrlObj.playlist[0].file);
      }
      // if (getXpath("//div[@id='tab-description']//iframe/@src", 'nodeValue') != null) {
      //   const videoPath = getXpath("//div[@id='tab-description']//iframe/@src", 'nodeValue');
      //   addElementToDocument('added_video_url', videoPath);

      // added specification
      const specificationsXpath = getAllXpath("//table[@class='flix-std-specs-table']//tbody//tr//td", 'innerText');
      var specificationsList = specificationsXpath.join('||');
      // console.log('>>>>>>>>>' + specificationsList);
      addElementToDocument('added_specifications', specificationsList);

      document.getElementById('more-information').classList.remove('closed');
      window.setTimeout(function () {
        const manufacturerImages = getAllXpath("//div[@class='flix-background-image inpage_wowimg']/img/@srcset", 'nodeValue');
        addElementToDocument('added_manufacturerImage', manufacturerImages);
      }, 10000);

      
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};
