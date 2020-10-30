const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IE',
    store: 'joyces',
    transform: cleanUp,
    domain: 'joyces.ie',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(async function () {
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

      let scrollTop = 500;
      while (true) {
        window.scroll(0, scrollTop);
        await stall(1000);
        scrollTop += 500;
        if (scrollTop === 10000) {
          break;
        }
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

      var weightNetStr = getXpath("//table[@class='flix-std-specs-table']", 'innerText');
      let weightNet;
      if (weightNetStr != null) {
        weightNetStr = weightNetStr.toLowerCase();
        if (weightNetStr.includes('weight') && weightNetStr.includes('kg')) {
          weightNet = weightNetStr.substring(weightNetStr.lastIndexOf('weight') + 7, weightNetStr.lastIndexOf('kg') + 2);
          addElementToDocument('added_weightNet', weightNet);
          console.log(weightNet);
        }
      }
      if (weightNet !== '') {
        weightNet = getXpath("//div[@id='tab-description']//p[contains(text(),'kg')]", 'innerText');
        addElementToDocument('added_weightNet', weightNet);
      }

      const descriptionInfoXpath = "//div[@class='woocommerce-product-details__short-description']//p";
      const descriptionInfo = getXpath(descriptionInfoXpath, 'innerText');
      const tabDescriptionInfoXpath = "//div[@id='tab-description']";
      const tabDescriptionInfo = getAllXpath(tabDescriptionInfoXpath, 'innerText');
      let finalDescriptionInfo;
      if (tabDescriptionInfo !== null && tabDescriptionInfo.length > 0) {
        if (descriptionInfo != null) {
          finalDescriptionInfo = descriptionInfo + '||' + tabDescriptionInfo.join('||');
        } else {
          finalDescriptionInfo = tabDescriptionInfo.join('||');
        }
        finalDescriptionInfo.split('||').forEach((item) => {
          addElementToDocument('added_description', item);
        });
      } else {
        finalDescriptionInfo = descriptionInfo;
        addElementToDocument('added_description', finalDescriptionInfo);
      }

      let additionalBulletInfo;
      const additionalDescriptionInfoXpath = "//div[@id='tab-description']//ul/li";
      const additionalDescriptionInfo = getAllXpath(additionalDescriptionInfoXpath, 'innerText');
      if (additionalDescriptionInfo !== null && additionalDescriptionInfo.length > 0) {
        additionalBulletInfo = additionalDescriptionInfo.join('||');
        additionalBulletInfo.split('||').forEach((item) => {
          addElementToDocument('added_description_bullet_info', item);
        });
      }
      // Manufacture Description
      const manufacturerDescriptionXpathOption = getAllXpath("//div[contains(@id,'inpage_container')]//div[(contains(@class,'flix-d-p') or contains(@class,'flix-std-desc')) and not(contains(@class,'flix-title')or contains(@class,'flix-caveat-desc'))]", 'innerText');
      if (manufacturerDescriptionXpathOption.length > 0) {
        addElementToDocument('added_manufacturerDescription', manufacturerDescriptionXpathOption);
      }
      const videoUrlPath = getXpath("//div[@class='fullJwPlayerWarp']//input[@class='flix-jw']/@value", 'nodeValue');
      if (videoUrlPath && typeof videoUrlPath === 'string') {
        var videoUrlObj = JSON.parse(videoUrlPath);
        addElementToDocument('added_video_url', 'http:' + videoUrlObj.playlist[0].file);
      }
      if (getXpath("//div[@id='tab-description']//iframe/@src", 'nodeValue') != null) {
        const videoPath = getXpath("//div[@id='tab-description']//iframe/@src", 'nodeValue');
        addElementToDocument('added_video_url', videoPath);
      }
      function specification (data) {
        var specificationsData = data.join(' || ');
        addElementToDocument('added_specifications', specificationsData);
      }
      let specificationsList = getAllXpath("//table[@class='flix-std-specs-table']/tbody/tr/td", 'innerText');
      if (specificationsList !== null && specificationsList.length > 0) {
        specification(specificationsList);
      } else {
        specificationsList = getAllXpath("//div[@id='tab-description']//ul[position()>1]//li", 'innerText');
        if (specificationsList !== null && specificationsList.length > 0) {
          specification(specificationsList);
        }
      }
      var descBulletCount = getAllXpath("//div[@id='tab-description']//ul//li", 'innerText');
      if (descBulletCount !== null && descBulletCount.length > 0) {
        addElementToDocument('added_bulletCount', descBulletCount.length);
      }
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};
