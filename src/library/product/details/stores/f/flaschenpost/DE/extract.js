const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'flaschenpost',
    transform: cleanUp,
    domain: 'flaschenpost.de',
    zipcode: '28203',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    var wantedZip = '28203';
    await new Promise((resolve, reject) => setTimeout(resolve, 10000));
    await context.click('a[class="fp-changeZipCode fp-footer-changeZipCode"]');
    await context.setInputValue('[id="validZipcode"]', wantedZip);
    await context.waitForSelector('button[class="fp-button fp-button--primary zip--button fontSizeL"]', 6000)
    await context.click('button[class="fp-button fp-button--primary zip--button fontSizeL"]');
    await context.waitForFunction(function (xp) {
      return Boolean(document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 100000 }, '//script[contains(text(),"variant")]/text()');
    const applyScroll = async function (context) {
      await context.evaluate(async () => {        
        let scrollTop = 0;
        while (scrollTop !== 20000) {
          scrollTop += 1000;
          window.scroll(0, scrollTop);
          await stall(1000);
        }
        function stall(ms) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }
      });
    };
    await applyScroll(context);
    await context.evaluate(async function () {
      function addHiddenDiv(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('div[class="fp_product_details"] div[class*="fp_article"] div[class="fp_article_details"]')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      var getXpath = (xpath, prop) => {
        var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };

      var vari = getXpath('//script[contains(text(),"variant")]/text()', 'nodeValue');
      console.log('pathhhhhhh', vari)
      if (vari != null) {
        if (vari.includes("id:'")) {
          var ids = vari.split("id:'");
          let finalIds = [];
          for (let j = 1; j < ids.length; j++) {
            if (ids[j].includes("',")) {
              console.log('abc', ids[j])
              finalIds.push(ids[j]);
            }
          }
          for (var i = 0; i < finalIds.length; i++) {
            var temp = finalIds[i].split("',")[0];
            addHiddenDiv('rpc', temp, i);
            console.log('tempppppppppp', temp)
          }
        }
      }
    });
    return await context.extract(productDetails, { transform });
  },
};