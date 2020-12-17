
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'lyreco',
    transform: null,
    domain: 'lyreco.com',
    zipcode: '',
  },
  implementation: async ({ inputstring }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(() => {
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
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
      var dee = getAllXpath('//div[@id="blocdiv2"]/div/span/text()', 'nodeValue');
      if (dee != null) {
        var str = dee.join(" || ");
        addElementToDocument('str', str);
      }
      var sec = getAllXpath('(//ul[@class="product_miniature_cms float jcarousel-list jcarousel-list-vertical"]/li/a/div[@class="hd_miniature hd_miniature_border"])[position()>1]/@style', 'nodeValue');
      if (sec != null) {
        for (var i = 0; i < sec.length; i++) {
          addElementToDocument('sec_img', sec[i].slice(95, -3));
        }
      }
      var spec = getAllXpath('//section[@id="specification"]//div[@class="container px-0"]/div/p/span/text()', 'nodeValue');
      if (spec != null) {
        var srr = "";
        for (var i = 0; i < spec.length; i = i + 2) {
          srr = srr + spec[i].trim() + " " + spec[i + 1].trim() + " || "
        }
        srr = srr.slice(0, -3)
        addElementToDocument('srr', srr);
      }
      var bull = getAllXpath('//div[@class="description_keySellingPoints"]/div/ul/li/p/text()', 'nodeValue');
      if (bull != null) {
        var desbullets = bull.join(" || ");
        addElementToDocument('desbullets', desbullets);
      }
      var abc = getXpath('//div[@class="video_s7 hd_miniature"]/@style', 'nodeValue');
      if (abc != null) {
        abc = abc.slice(23, -33);
        addElementToDocument('abc', abc);
      }
      var size = getXpath('//div[@class="descriptionAndReference_cms "]/h1/text()', 'nodeValue');
      if (size != null) {
        var aar = [];
        aar = size.split(" ");
        if (aar[0] == "pack" || aar[1] == "de") {
          var packsize = aar[0] + " " + aar[1] + " " + aar[2];
          addElementToDocument('packsize', packsize);
        }
      }
      var pipe = getAllXpath('//div[@class="product-selector--valueDisplay"]/text()', 'nodeValue');
      if (pipe != null) {
        var pipeline = pipe.join(" || ");
        addElementToDocument('pipeline', pipeline);
      }
      });
    await context.extract(productDetails);
  },
};

