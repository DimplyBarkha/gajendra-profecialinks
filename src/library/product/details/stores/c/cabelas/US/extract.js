const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'cabelas',
    transform: cleanUp,
    domain: 'cabelas.com',
    zipcode: '',
  },

  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
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

      var getXpath = (xpath, prop) => {
        var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };

      // const sliceURL = (data) => {
      //   for (let index = 0; index < data.length; index++) {
      //     var image = data[index].slice(50, -3);
      //     addElementToDocument('altImages', data[index].slice(50, -3));
      //   }
      // };
      var backgroundURL = getXpath("(//div[@class='s7thumb'])[1]/@style", 'nodeValue');
      if (backgroundURL != null) {
        var i = backgroundURL.slice(50, -3);
        i = i.replace("wid=56", "wid=300");
        i = i.replace("hei=56", "wid=300");
        addElementToDocument('altImages', i);
      }
      // sliceURL(backgroundURL);

      const sliceURL1 = (data) => {
        for (let index = 0; index < data.length; index++) {
          var abc = data[index].slice(50, -3);
          abc = abc.replace("wid=56&hei=56", "wid=500&hei=500");
          addElementToDocument('alter', abc);
        }
      };
      var alter = getAllXpath("(//div[@class='s7thumb'])[position() >1]/@style", 'nodeValue');
      if (alter != null) {
        sliceURL1(alter);
      }


      //description
      var desc1 = getXpath('(//div[@class="VProduct_img"]/following-sibling::div/p)/text()[1]', 'nodeValue');
      var desc2 = getXpath('(//div[@class="VProduct_img"]/following-sibling::div/p)/text()[2]', 'nodeValue');
      if (desc2 != null) {
        desc1 = desc1 + "\n" + desc2 + " \n";
      }
      var desc3 = getAllXpath('(//div[@class="VProduct_img"]/following-sibling::div)/ul/li/text()', 'nodeValue');
      var desc7 = getAllXpath('//div[@class="col12 acol12 ccol4 left slot7"]/text()', 'nodeValue');
      var xx = "";
      desc7.forEach(zz => {
        if (zz.includes("Web")) {
          xx = zz;
        }
      })
      xx = xx.trim();
      // if (desc3 != null && xx != null) {
      //   var desc4 = desc3.join(" || ");
      //   var main = desc1 + " || " + desc4+" "+xx;
      // }
      if (desc3 != null && xx != null) {
        var desc4 = desc3.join(" ");
        var main = desc1 + "  " + desc4;
      }

      addElementToDocument('desc', main);

      var size = getXpath('//div[@class="definingAttributes"]/div[contains(text(),"Size")]/text()', 'nodeValue');
      if (size != null) {
        size = size.split(": ")[1];
        addElementToDocument('size', size);
      }

      var mpc = getXpath('//div[@class="col2 gridCell ModelNumber unanchored"]/div/text()', 'nodeValue');
      if (mpc == null) {
        mpc = getXpath('(//div[@class="VProduct_img"]/following-sibling::div/p)/text()[2]', 'nodeValue');
        if (mpc != null) {
          mpc = mpc.split(": ")[1];
          if (mpc != null) {
            mpc = mpc.replace(".", "");
          }
        }
      }
      addElementToDocument('mpc', mpc);


      var bullet = getAllXpath('(//div[@class="VProduct_img"]/following-sibling::div)/ul/li/text()', 'nodeValue');
      if (bullet != null) {
        var bullet1 = bullet.join(" || ");
        bullet1 = " || " + bullet1;
        if (bullet1 != null) {
          addElementToDocument('bullet1', bullet1);
        }
      }

      var warn = getXpath('//div[@id="CA_PROP65_Dialog_Disclaimer"]/li/text()[2]', 'nodeValue');
      if (warn != null) {
        warn = warn.split(": ")[1];
        var warn1 = getXpath('//div[@id="CA_PROP65_Dialog_Disclaimer"]/li/a/text()', 'nodeValue');
        if (warn1 != null) {
          var warning = warn + warn1;
          addElementToDocument('warning', warning);
        }
      }

      var ppp = 0;
      addElementToDocument('ppp', ppp);

      var varinfo = getXpath('//div[@class="definingAttributes"]/div[contains(text(),"Color")]/text()', 'nodeValue');
      if (varinfo != null) {
        varinfo = varinfo.split(": ")[1];
        addElementToDocument('varinfo', varinfo);
      }

      var brand = getXpath('(//a[@class="logo-size"]/img)[1]/@alt', 'nodeValue');
      if (brand != null) {
        brand = brand.split(" ")[0];
        addElementToDocument('brand', brand);
      }

      // brand
      // var brand = "Cabelas";
      // addElementToDocument('brand', brand);

      // RPC
      // var first = getXpath('(//span[@class="sku"])/text()', 'nodeValue');
      var rpc = getXpath('//div[@class="pdp_non_chart_wishlist"]//img[@style="display:none;"]/@src', 'nodeValue');
      if (rpc != null) {
        if (rpc.includes("/")) {
          var arr = rpc.split("/");
          rpc = arr[arr.length - 1];
          if (rpc.includes("_")) {
            rpc = rpc.split("_")[0];
            addElementToDocument('rpc', rpc);
          }
        }
      } else {
        var rpc2 = getXpath('//div[@class="widget_product_image_viewer"]/input/@value', 'nodeValue');
        if (rpc2 != null) {
          if (rpc2.includes("/")) {
            var arr = rpc2.split("/");
            rpc2 = arr[arr.length - 1];
            if (rpc2.includes("_")) {
              rpc2 = rpc2.split("_")[0];
              addElementToDocument('rpc', rpc2);
            }
          }
        }
      }

      //image
      var img1 = getXpath('//div[@class="pdp_non_chart_wishlist"]//img[@style="display:none;"]/@src', 'nodeValue');
      var img2 = getXpath('//div[@class="widget_product_image_viewer"]/input/@value', 'nodeValue');
      if (img1 != null) {
        addElementToDocument('image', img1);
      } else if (img2 != null) {
        addElementToDocument('image', img2);
      }

    });
    await context.extract(productDetails);
  },
};

