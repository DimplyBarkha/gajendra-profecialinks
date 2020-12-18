
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'monclick',
    transform: null,
    domain: 'monclick.it',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
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
      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      var backgroundURL = getAllXpath('(//div[@class="small-12 medium-12 large-12 columns"])[1]//text()', 'nodeValue');
      var xyz = []
      for(var i=0; i<backgroundURL.length ; i++){
      if(backgroundURL[i].length > 1){
      xyz.push(backgroundURL[i]);
      }
      }
      var specification =xyz.join(" || ");
      addElementToDocument('specification', specification);
      // @ts-ignore
      const rawdata = document.querySelectorAll('script[type="application/ld+json"]')[1].innerText;
      const jsondata = JSON.parse(rawdata);
      const gtin = jsondata.gtin13;
      const mpn = jsondata.mpn;
      const aggregateRating = jsondata.aggregateRating.ratingValue;
      const ratingCount = jsondata.aggregateRating.reviewCount;
      addElementToDocument('gtin', gtin);
      addElementToDocument('mpn', mpn);
      addElementToDocument('aggregateRating', aggregateRating);
      addElementToDocument('ratingCount', ratingCount);
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};
