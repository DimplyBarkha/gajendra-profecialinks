const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'MX',
    store: 'coppel',
    transform: cleanUp,
    domain: 'coppel.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 5000));
      await context.waitForXPath("//div[@id='flix-inpage']//img/@srcset | //div[@id='flix-inpage']//img/@data-img-src|//div[@id='flix-inpage']//img/@data-srcset", {}, { timeout: 100000 });
      await context.waitForSelector('div[id="flix-inpage"] img', {}, { timeout: 100000 });
    } catch (error) {
      console.log(error);
    }

    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.className = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
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

      function stall (ms) {
        // @ts-ignore
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

      const skuXpath = getXpath("//span[@class='sku']//text()", 'nodeValue');
      console.log('sku: ', skuXpath);
      if (skuXpath != null) {
        const sku = skuXpath ? skuXpath.split(':') : [];
        addElementToDocument('sku_added', sku[1]);
      }

      const gtinupc = getXpath("//table[@class='table table-bordered']/tbody/tr/td[contains(.,'Modelo #:')]/following-sibling::td", 'innerText');
      if (gtinupc != null) {
        console.log('upc: ', gtinupc);
        addElementToDocument('gtin_added', gtinupc);
      }

      const size = getXpath("//div[@class='flix-tech-spacs-contents']/ul/li/div[contains(.,'Tamaño de la pantalla')]/div[@class='flix-dd']|//table[@class='table table-bordered']/tbody/tr/td[contains(.,'Pulgadas:')]/following-sibling::td|//table[@class='table table-bordered']/tbody/tr/td[contains(.,'Tamaño de pantalla:')]/following-sibling::td", 'innerText');
      if (size != null) {
        console.log('size: ', size);
        addElementToDocument('size_added', size);
      }

      const altxpath = getXpath("//*[@id='Zoomer']/figure/img/@alt", 'nodeValue');
      if (altxpath != null) {
        const altimg = altxpath.split('|');
        const splittedalt = altimg[1].split('&#034;');
        if (splittedalt[0] != null) {
          console.log('altxpath: ', splittedalt[0]);
          addElementToDocument('alt_added', splittedalt[0]);
        } else {
          addElementToDocument('alt_added', splittedalt);
        }
      }

      const sizeValue = getXpath("//input[contains(@id,'quantity_')]/@value", 'nodeValue');
      if (sizeValue != null) {
        console.log('size: ', sizeValue);
        addElementToDocument('size_added', sizeValue);
      }

      const gtinXpath = getXpath("//input[@id='gtin']/@value", 'nodeValue');
      if (gtinXpath != null) {
        console.log('gtin: ', gtinXpath);
        const gtinValue = gtinXpath ? gtinXpath.split(':') : [];
        addElementToDocument('gtin_added', gtinValue[1]);
      }

      const altImgXpath = getAllXpath("//div[@id='ProductAngleImagesArea']/ul/li[position()>1]/a/img/@src", 'nodeValue');
      if (altImgXpath.length > 0) {
        console.log('AltImgXpath:', altImgXpath.join('|'));
        addElementToDocument('altImgs_added', altImgXpath.join(' | '));
      }

      const manufactureImageXpath = getAllXpath("//div[@id='flix-inpage']//img/@data-img-src|//div[@id='flix-inpage']//img/@data-srcset|//div[@id='flix-inpage']//img/@data-flixsrcset", 'nodeValue');
      try {
        if (manufactureImageXpath.length > 0) {
          console.log('Manufacturer Images ==>', manufactureImageXpath);
          const manufactureImages = [];
          manufactureImageXpath.forEach(item => {
            if (item.includes(',')) {
              const ImagesSetPath = item.split(',');
              const imageStr = ImagesSetPath[0];
              item = imageStr.substr(0, imageStr.lastIndexOf(' '));
            }
            manufactureImages.push('https:' + item);
          });
          addElementToDocument('aplusImages_added', manufactureImages.join(' | '));
        }
      } catch (error) {
        console.log(error);
      }

      const videoUrlPath = getAllXpath("//input[@class='flix-jw']/@value", 'nodeValue');
      if (videoUrlPath.length > 0) {
        for (let i = 0; i < 1; i++) {
          if (videoUrlPath[i] && typeof videoUrlPath[i] === 'string') {
            console.log(videoUrlPath[i]);
            try {
              var videoUrlObj = JSON.parse(videoUrlPath[i]);
              videoUrlObj.playlist.forEach(element => {
                addElementToDocument('added_video_url', 'https:' + element.file);
              });
            } catch (error) {
              console.log(error);
            }
          }
        }
      }
      const videoUrlPath1 = getAllXpath("//div[contains(@class,'flix_jw_videoid')]/@data-jw", 'nodeValue');
      try {
        if (videoUrlPath1.length > 0) {
          for (let i = 0; i < videoUrlPath1.length; i++) {
            if (videoUrlPath1[i] && typeof videoUrlPath1[i] === 'string') {
              addElementToDocument('added_video_url', 'https:' + videoUrlPath1[i]);
            }
          }
        }
      } catch (error) {
        console.log(error);
      }

      const manufactureXpath = getAllXpath("//div[@id='flix-inpage']", 'innerText');
      const paginationPath = getXpath("//p[contains(@class,'fl1xcarousel-pagination')]", 'innerText');
      if (manufactureXpath.length > 0) {
        addElementToDocument('added_manufacture', manufactureXpath.join('|').replace(paginationPath, ' '));
      }

      const allSpecs = getAllXpath("//table[@class='table table-bordered']/tbody/tr/td", 'innerText');
      if (allSpecs.length > 0) {
        console.log('Specifications:', allSpecs);
        addElementToDocument('specs_added', allSpecs.join(' '));
      }

      if (altImgXpath.length > 0) {
        console.log('secondaryImg total:', altImgXpath.length);
        addElementToDocument('secondaryImgcount_added', altImgXpath.length);
      }
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};
