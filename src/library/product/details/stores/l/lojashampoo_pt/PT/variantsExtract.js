module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'PT',
    store: 'lojashampoo_pt',
    transform: null,
    domain: 'lojashampoo.pt',
    zipcode: '',
  },
  implementation,
};
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { variants } = dependencies;
  await context.evaluate(async function () {
    // Add Element 
    function addElementToDocument(key, value) {
      const catElement = document.createElement('div');
      catElement.className = key;
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

    // Method to Retrieve Xpath content of a Multiple Nodes

    var getXpath = (xpath, prop) => {
      var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
      let result;
      if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
      else result = elem ? elem.singleNodeValue : '';
      return result && result.trim ? result.trim() : result;
    };
    // Variant Url
    var noPage = document.querySelector('img[id="imagerror"]');
    var url = "https://www.lojashampoo.pt/"
    var ean = getAllXpath('//div[contains(@id,"option_")]/@id', 'nodeValue');
    // var ean = [3600522851288, 3600521795484, 3600521342015, 3600521966402, 3600522851028, 3600521966372, 3600522851165, 3054080055846, 3600521114636, 3600521115732, 3600522851066, 3600521115756, 3600521967850, 3600521967867];
    if (ean.length >= 1) {
      for (var i = 0; i < ean.length; i++) {
        ean[i] = parseInt(ean[i].match(/\d+/g).join());
      }
      for (var i = 0; i < ean.length; i++) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://www.lojashampoo.pt/index.php?route=product/product/imagesCarousel&ean=' + ean[i]);
        xhr.responseType = 'json';
        xhr.send();
        xhr.onload = function () {
          let responseObj = xhr.response;
          // console.log(responseObj.product);
          var pname = responseObj.product.toLowerCase();
          if (pname.match(/(\.).\d*g|''/) != null) {
            addElementToDocument('variants', url.concat(pname.replace(pname.match(/(\.).\d*g|''/)[1], '-').replace(/\s/gm, '-').replace(/\'|\?|\-+/gm, '-')));
          } else if (pname.match(/(\.).\d*ml|''/) != null) {
            addElementToDocument('variants', url.concat(pname.replace(pname.match(/(\.).\d*ml|''/)[1], '-').replace(/\s/gm, '-').replace(/\'|\?|\-+/gm, '-')));
          }
          else {
            addElementToDocument('variants', url.concat(pname.replace(/\s/gm, '-').replace(/\'|\?|\-+|\+/gm, '-')));
          }

        };
      }

    } else if (noPage != null) {
      // No page code
    } else {
      addElementToDocument('variants', window.location.href);
    }
  });
  return await context.extract(variants, { transform });
}