
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PE',
    store: 'linio',
    transform: null,
    domain: 'linio.com',
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
    // <script src="https://googleads.g.doubleclick.net/pagead/viewthroughconversion/980337278/?random=1611762701055&amp;cv=9&amp;fst=1611762701055&amp;num=1&amp;label=vbACCPnWgl8Q_oS70wM&amp;guid=ON&amp;resp=GooglemKTybQhCsO&amp;eid=376635470&amp;u_h=768&amp;u_w=1366&amp;u_ah=768&amp;u_aw=1366&amp;u_cd=24&amp;u_his=2&amp;u_tz=330&amp;u_java=false&amp;u_nplug=3&amp;u_nmime=4&amp;gtm=2wg1d0&amp;sendb=1&amp;ig=1&amp;data=ecomm_prodid%3D5946641%3Becomm_pagetype%3Dproduct%3Becomm_totalvalue%3D225&amp;frm=0&amp;url=https%3A%2F%2Fwww.linio.com.pe%2Fp%2Fenfagrow-preescolar-promocio-n-1100g-x-3-unidades-x01i3v&amp;tiba=Enfagrow%C2%AE%20Preescolar%20-%20Promoci%C3%B3n%201100g%20x%203%20Unidades%20%7C%20Linio%20Per%C3%BA%20-%20EN654TB08QBJQLPE&amp;hn=www.googleadservices.com&amp;async=1&amp;rfmt=3&amp;fmt=4"></script>
     // @ts-ignore
    //  const rawdata = document.querySelectorAll('script[type="text/javascript"]')[30].innerText;
    //  console.log(rawdata,'=====================')
     // @ts-ignore
    //  var z/ =rawdata.toString()
    //  var a=(rawdata).split('product_id":"');
    //  console.log(a,'=====================')

    //  var z=a.split('","')[0];
    //  addElementToDocument('product_id', z);

  //   // Method to Retrieve Xpath content of a Multiple Nodes
  //   const getAllXpath = (xpath, prop) => {
  //   const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  //   const result = [];
  //   for (let index = 0; index < nodeSet.snapshotLength; index++) {
  //   const element = nodeSet.snapshotItem(index);
  //   if (element) result.push(prop ? element[prop] : element.nodeValue);
  //   }
  //   return result;
  //   };
    var getXpath = (xpath, prop) => {
    var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
    let result;
    if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
    else result = elem ? elem.singleNodeValue : '';
    return result && result.trim ? result.trim() : result;
    };
    var backgroundURL = getXpath('//iframe/@src', 'nodeValue');
    if (backgroundURL.length > 0)
  { 
  var a=(backgroundURL).split('offer_')[1];
  }
  else{
    a= ''
  }
  addElementToDocument('product_id', a);
  //   var brand = getAllXpath('//a[@itemprop="brand"]//text()', 'nodeValue');
  //   // var brand1= brand.ignoreCase;
  //   var nameExptend;
  //   // @ts-ignore
  //   var ignoreCase = require('ignore-case');
  //     if (backgroundURL.includes('brand'.toUpperCase()) {
  //       nameExptend = backgroundURL
  //     }
  //     else{
  //       nameExptend = brand + ' ' + backgroundURL;
  //     }
  //   console.log(nameExptend,'----------------nameextend')
  //   addElementToDocument('nameExptend', nameExptend);
   
  });
  await context.extract(productDetails);
  },
  };

