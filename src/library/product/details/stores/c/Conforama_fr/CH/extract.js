
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'Conforama_fr',
    transform: null,
    domain: 'conforama.ch',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.waitForFunction(async function () {
      var elem, scrollTotalHeight;
      elem = document.querySelector('body');
      let scrollTop = 0;
      while (scrollTop !== elem.scrollHeight) {
        await stall(500);
        scrollTop += 500;
        window.scroll(0, scrollTop);
        if (scrollTop > elem.scrollHeight) {
          scrollTotalHeight = elem.scrollTop + elem.offsetHeight
          break;
        }
      }
      function stall(ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      if (scrollTotalHeight === elem.scrollHeight) {
        return Boolean(true);
      }
    }, { timeout: 10000 });

    await context.evaluate(() => {
      function waitForElement(elementId, callBack) {
        window.setTimeout(function () {
          var element = document.getElementById(elementId);
          if (element) {
            callBack(elementId, element);
          } else {
            waitForElement(elementId, callBack);
          }
        }, 90000);
      };
      const checkNode = window.document.evaluate('//div[@class="flix-inpage" and not(@style="display:none;")]', window.document, null, XPathResult.ANY_TYPE, null).iterateNext();
      if (checkNode != null) {
        waitForElement("inpage_container", function () {
          console.log("done");
        });
      }
      function addHiddenDiv(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('div[class="productInfosContent normal clearfix"]')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      var brandName = "";
      try {
        let listPrice, price;
        // @ts-ignore
        listPrice = document.querySelectorAll('span[class="old-infos oldPrice"]')[0].innerText;
        var listpriceUpdated = listPrice.replace("€", ".");
        addHiddenDiv('listpriceUpdated', '€ ' + listpriceUpdated, 0);
      } catch (error) {

      }
      try {
        let price;
        // @ts-ignore
        price = document.querySelectorAll('div[class="currentPrice"]')[0].innerText;
        var priceUpdated = price.replace("€", ".");
        addHiddenDiv('priceUpdated', '€ ' + priceUpdated, 0);
      } catch (error) {
      }
      try {
        
        var temp;
        let dataScript = document.querySelectorAll('script[type="application/ld+json"]');
        for (let i = 0; i < dataScript.length; i++) {
          // @ts-ignore
          temp = dataScript[i].innerText;
          if (temp.includes('availability')) {
            temp = JSON.parse(temp);
            addHiddenDiv('availabilty', temp.offers.availability, 0);
            brandName = temp.brand.name;
          }
        }
      } catch (error) {

      }
      try {
        if (brandName.length == 0 || brandName == 'Conforama') {
          // @ts-ignore
          brandName = document.querySelector('div[class="productTitle"]>div>h1>a').innerText;
          brandName = brandName.split(' ')[0];
          addHiddenDiv('brand', brandName, 0);
        }
        else {
          addHiddenDiv('brand', brandName, 0);
        }
      } catch (error) {

      }
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
      // Double Pipe Concatenation
      const pipeSeparatorDouble = (id, data) => {
        var doubleSeparatorText = data.join(' || ');
        addHiddenDiv(id, doubleSeparatorText, 0);
      };
      // Single Pipe Concatenation
      const pipeSeparatorSingle = (id, data) => {
        var SingleSeparatorText = data.join(' | ');
        addHiddenDiv(id, SingleSeparatorText, 0);
      };

      // XPATH Data Extraction For Additional Description Bullet
      const addDescBulletInfo = getAllXpath("//div[@id='tabs-1']/ul/li/text()", 'nodeValue');
      pipeSeparatorDouble('addDescBulletInfo', addDescBulletInfo);

      const addDescInfo = getAllXpath("//div[@id='tabs-1']//text()", 'nodeValue');
      var addDescInfoFinal = [];
      for (let i = 0; i < addDescInfo.length; i++) {
        if (addDescInfo[i].length > 2) {
          addDescInfoFinal.push(addDescInfo[i]);
        }
      }
      pipeSeparatorDouble('addDescInfo', addDescInfoFinal);
      const manufacturerImages = getAllXpath("//div[@id='inpage_container']//img/@srcset", 'nodeValue');
      pipeSeparatorSingle('manufacturerImages', manufacturerImages);
      const variants = getAllXpath("//div[@class='tab-content subList']/div/@data-color", 'nodeValue');
      pipeSeparatorSingle('variants', variants);
    });
    return await context.extract(productDetails, { transform });
  },
};
