// @ts-nocheck

class SharedHelpers {
  constructor (context) {
    this.context = context;
  }

  async addHiddenInfo (elementID, content, contentArr = []) {
    contentArr = contentArr.length ? contentArr : [content];
    await this.context.evaluate(async function (elementID, content, contentArr) {
      if (contentArr.length === 0) {
        contentArr.push(content);
      } else {
        // contentArr.push('');
        contentArr.forEach((element) => {
          const newDiv = document.createElement('div');
          newDiv.id = elementID;
          newDiv.textContent = element;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
        });
      }
    }, elementID, content, contentArr);
  }

  async addHiddenArrayList (elementID, value) {
    await this.context.evaluate(async function (elementID, value) {
      const htmlString = `<span style="display:none" id="added_${elementID}" ></span>`;
      const root = document.body;
      root.insertAdjacentHTML('beforeend', htmlString);
      const innerHTML = value.reduce((acc, val) => {
        return `${acc}<li>${val}</li>`;
      }, '<ul>') + '</ul>';
      document.querySelector(`#added_${elementID}`).innerHTML = innerHTML;
    }, elementID, value);
  }

  async getEleByXpath (xpath) {
    return await this.context.evaluate((xpath) => {
      const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      console.log('Element' + element);
      const text = element ? element.textContent : null;
      return text;
    }, xpath);
  }

  async goToiFrameLink (apiManufCall, link, imgSelector, getAttrImgSrc, vidSelector, getAttrVidSrc, inBoxSelector, comparisionTableSelector) {
    let content = null;
    let image = null;
    let video = null;
    let inBoxText = null;
    let inBoxUrls = null;
    let comparisionText = null;
    await this.context.goto(apiManufCall, {
      timeout: 100000,
      waitUntil: 'load',
    });
    try {
      await this.context.waitForSelector('div.more, .preview-more a', { timeout: 35000 });
      await this.context.click('div.more, .preview-more a');
    } catch (error) {
      console.log('No preview button');
    }
    await this.context.evaluate(async () => {
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
    const text = await this.context.evaluate(async function () {
      return document.querySelector('body').innerText;
    });
    if (inBoxSelector) {
      const inTheBoxData = await this.context.evaluate(async function (inBoxSelector, getAttrImgSrc) {
        const inBoxUrls = [];
        const inBoxText = [];
        const getAllProducts = document.querySelectorAll(inBoxSelector + ' div:not(.side-pics)');
        for (let i = 0; i < getAllProducts.length; i++) {
          inBoxUrls.push(getAllProducts[i].querySelector('img').getAttribute(getAttrImgSrc));
          inBoxText.push(getAllProducts[i].querySelector('p').innerText);
        }
        return { inBoxText, inBoxUrls };
      }, inBoxSelector, getAttrImgSrc);
      inBoxText = inTheBoxData.inBoxText;
      inBoxUrls = inTheBoxData.inBoxUrls;
    }
    if (comparisionTableSelector) {
      comparisionText = await this.context.evaluate(async function (comparisionTableSelector) {
        return (!!document.querySelector(comparisionTableSelector) && document.querySelector(comparisionTableSelector).offsetHeight > 0 && document.querySelector(comparisionTableSelector).offsetWidth) > 0;
      }, comparisionTableSelector);
    }
    console.log(inBoxText);
    content = text;

    await this.context.waitForSelector(imgSelector, { timeout: 30000 });
    const images = await this.context.evaluate(async function (imgSelector, getAttrImgSrc) {
      const images = document.querySelectorAll(imgSelector);
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
        imagesSrc.push(element.getAttribute(getAttrImgSrc));
      });
      if (srcUnique.length >= 1) {
        srcUnique.forEach(src => {
          imagesSrc.push(src);
        });
      }
      return imagesSrc;
    }, imgSelector, getAttrImgSrc);
    image = images;

    if (vidSelector && vidSelector.length) {
      video = await this.context.evaluate(async function (vidSelector, getAttrVidSrc) {
        const videosElements = document.querySelectorAll(vidSelector);
        const videoSrc = [];
        [...videosElements].forEach((element) => {
          if (element.getAttribute(getAttrVidSrc)) {
            videoSrc.push(element.getAttribute(getAttrVidSrc).toString());
          }
        });
        const videosArr = Array.from(new Set(videoSrc));
        return videosArr.join(' || ');
      }, vidSelector, getAttrVidSrc);
    }
    await this.context.goto(link);
    return { content: content, image: image, video: video, inBoxText: inBoxText, inBoxUrls: inBoxUrls, comparisionText: comparisionText };
  }

  async selectorAvailable (cssSelector) {
    console.log(`Is selector available: ${cssSelector}`);
    return await this.context.evaluate(function (selector) {
      return !!document.querySelector(selector);
    }, cssSelector);
  };

  async autoScroll () {
    await this.context.evaluate(async function () {
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

  async addVariants (createUrl, urlRegex, variantRegex, variantNodesSelector, variantAttribute) {
    await this.context.evaluate(function () {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
        return newDiv;
      }

      const variantList = [];

      function getVariantsText (url) {
        let variantUrl = url.match(urlRegex) ? url.match(urlRegex)[0] : '';
        variantUrl = variantUrl.length ? (variantUrl.match(variantRegex) ? variantUrl.match(variantRegex)[0] : '') : '';
        return variantUrl;
      }

      const url = window.location.href;
      const mainVariant = getVariantsText(url);
      variantList.push(mainVariant);

      const variantNodes = document.querySelectorAll(variantNodesSelector);
      if (variantNodes.length) {
        [...variantNodes].forEach((element) => {
          const text = getVariantsText(element.getAttribute(variantAttribute));
          variantList.push(text);
        });
      }

      const variants = new Set(variantList);
      variants.forEach((element) => {
        addHiddenDiv('ii_variant', element);
      });
    }, createUrl, urlRegex, variantRegex, variantNodesSelector, variantAttribute);
  }
}
module.exports = SharedHelpers;
