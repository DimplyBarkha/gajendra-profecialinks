
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
      let selectElement3 = document.getElementsByClassName('mk-product-tech-specifications-item small-12 medium-6 large-6 columns float-left');
      var xyz = []
      for(var i=0; i<selectElement3.length ; i++){ 
        let selectElement4 = document.getElementsByClassName('mk-product-tech-specifications-item small-12 medium-6 large-6 columns float-left')[i].innerHTML;
        let value1 = selectElement4.replace(/<div[^>]*>|<\/div>/gi, "").replace(/\n/g, " ").replace(/<p[^>]*>|<\/p>/gi,'').replace(/<strong[^>]*>|<\/strong>/gi,'');
        xyz.push(value1);
        // let value1= selectElement4.getElementsByClassName('mk-product-tech-title');
        }
        var specification =xyz.join("||");
        addElementToDocument('specification', specification);
      // @ts-ignore
      const rawdata = document.querySelectorAll('script[type="application/ld+json"]')[1].innerText;
      const jsondata = JSON.parse(rawdata);
      var gtin =''
      var mpn =''
      var shipping=''
      var shipping1=''
      if ('offers' in jsondata){
      shipping = jsondata.offers.seller.name;
      shipping1 = "Organization"
      shipping= shipping+ '|' + shipping1
     }
     else{
      shipping = ''
     }
      if ('gtin13' in jsondata){
         gtin = jsondata.gtin13;
      }
      else{
        gtin = ''
      }
      if ('mpn' in jsondata){
        mpn = jsondata.mpn;
     }
     else{
        mpn = ''
     }
      var aggregateRating = ''
      var ratingCount =''
      addElementToDocument('gtin', gtin);
      addElementToDocument('mpn', mpn);
      console.log(shipping,'================shipp')
      addElementToDocument('shipping', shipping);
      if ('aggregateRating' in jsondata){
        aggregateRating = jsondata.aggregateRating.ratingValue;
        ratingCount = jsondata.aggregateRating.reviewCount;
      }
      else{
        aggregateRating = ''
        ratingCount = ''
      }
      console.log('aggregateRating+rating',aggregateRating,ratingCount)
      addElementToDocument('aggregateRating', aggregateRating);
      addElementToDocument('ratingCount', ratingCount);
      
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};
