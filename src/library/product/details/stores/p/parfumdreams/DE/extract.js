
const { cleanUp } = require("../../../../shared");
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'parfumdreams',
    transform: cleanUp,
    domain: 'parfumdreams.de',
    zipcode: '',
  },
  implementation: async ({ inputstring }, { country, domain }, context, { productDetails }) => {
    const FinalURL = await context.evaluate(async () => {
      return window.location.href;
    });
    const videoURL = await context.evaluate(async () => {
      var getXpath = (xpath, prop) => {
        var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      const url = getXpath('//div[@class="center mts2"]//a[@class="link-icon overlay cboxElement"]/@href', 'nodeValue');
      return url;
    });
    if (videoURL != null) {
      await context.goto('https://www.parfumdreams.de' + videoURL, { timeout: 20000, waitUntil: 'load', checkBlocked: false });
    }
    const videoxpath = await context.evaluate(async () => {
      var getXpath = (xpath, prop) => {
        var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      let xpathvideo = getXpath('//video[@class="vjs-tech"]/source[1]/@src', 'nodeValue');
      if (xpathvideo == null) {
        xpathvideo = 'empty';
      }
      return xpathvideo;
    });
    // if (videoURL != null) {
    await context.goto(FinalURL, { timeout: 20000, waitUntil: 'load', checkBlocked: true });
    // }
    if (videoxpath != 'empty') {
      await context.evaluate((videoxpath) => {
        addHiddenDiv('video', videoxpath);
        function addHiddenDiv(id, content) {
          const newDiv = document.createElement('div');
          newDiv.id = id;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
        }
      }, videoxpath);
    }
    await context.evaluate(() => {
      function addElementToDocument(key, value, d) {
        const catElement = document.createElement("div");
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        //const neww = document.querySelectorAll(los);
        //neww(catElement, neww);
        document.body.appendChild(catElement);
      }
      function addHiddenDiv(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll("div[class*='font-headline description']")[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };
      var getXpath = (xpath, prop) => {
        var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      var dec = getAllXpath('(//div[@class="variation-alt-images clearfix"]/div/@data-variation-id | //*[@id="schema-offer"]/div[1]/div/input/@value)', 'nodeValue');
      var str = "";
      if (dec != null) {
        str = dec.join(" | ");
        addElementToDocument('str', str);
      }
      var name = getXpath('//*[@id="schema-offer"]/div[2]/p[2]/text()', 'nodeValue');
      if (name != null) {
        if (name.includes("not available")) {
          name = "Out of Stock";
        } else {
          name = "In Stock";
        }
        //addElementToDocument('name', name);
      }
      var aggr = getXpath('//span[@itemprop="ratingValue"]/text()', 'nodeValue');
      if (aggr != null) {
        if (aggr.includes(",")) {
          addElementToDocument('aggr', aggr);
        } else {
          var nwaggr = aggr + ',0';
          addElementToDocument('aggr', nwaggr);
        }
        //addElementToDocument('name', name);
      }
      var perunit = getXpath('(//*[@id="schema-offer"]/div[2]/p[1]/text())[1]', 'nodeValue');
      if (perunit != null) {
        var priceper = perunit.split("/")[0].split('GP: ')[1];
        var peruni2 = perunit.split("/")[1];
        addElementToDocument('priceper', priceper);
        addElementToDocument('perunit', peruni2);
      }
      // var qty = getAllXpath('//div[@id="schema-offer"]/div[2]/div/div[1]/div/text()', 'nodeValue');
      // for (var i = 0; i < qty.length; i++){
      //   var aa= qty[i]
      //   addHiddenDiv('qty', aa, i)
      // }

      // var avi = getAllXpath('//div[@id="schema-offer"]/@data-outofstock', 'nodeValue');
      // for (var i = 0; i < avi.length; i++) {
      //   if (avi[i] != null) {
      //     if (avi[i].includes('False')) {
      //       addHiddenDiv('avail', 'In Stock', i)
      //     }
      //     else {
      //       addHiddenDiv('avail', 'Out of Stock', i)
      //     }
      //   }
      // }
      // @ts-ignore
      var d2 = document.querySelector('div[class="footer-content"]').innerText
      if (d2 != null) {
        addElementToDocument('d2', d2)
      }

      var desc = []

      var units = getAllXpath('//div[@id="schema-offer"]/div[2]/div/div[1]/div/text()', 'nodeValue');
      // @ts-ignore
      var unitz = document.querySelectorAll('div[id="variationsdropdown"]>ul> li> a> img').innerText
      if (units != null) {
        // @ts-ignore
        var name = document.querySelector("h1[class='article-header']").innerText
        
        for (var i = 0; i < units.length; i++) {
          addHiddenDiv('desc', name + '- ' + units[i], i)
          addHiddenDiv('qty', units[i], i)
        }
      }
      else {
        for (var i = 0; i < unitz.length; i++) {
          addHiddenDiv('desc', name + '- ' + unitz[i], i)
        }
      }

      var currurl = window.location.href
      addElementToDocument('currurl', currurl);
    });


    await context.extract(productDetails);

  },

};