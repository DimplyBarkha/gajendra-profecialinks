
const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'marionnaud',
    transform: cleanUp,
    domain: 'marionnaud.fr',
  },
  inputs: [
  ],
  dependencies: {
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
  },
  path: './stores/${store[0:1]}/${store}/${country}/extract',
  implementation,

};


async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;



  await context.evaluate(async function () {
    function addHiddenDiv(id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);

    }
    function addElementToDocument(key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }
    var getXpath = (xpath, prop) => {
      var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
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
    try {
      const Price1 = getAllXpath("//div[@class='price-list']//div[@class='finalPrice']/text()[1]", 'nodeValue');
      const Price2 = getAllXpath("//div[@class='price-list']//div[@class='finalPrice']/sup/text()", 'nodeValue');
      const Price3 = Price2[0].replace("€", ".");
      let finalprice = Price1[0] + Price3 + '€';
      addHiddenDiv('price', finalprice);

    } catch (error) {

    }

    // aggregate rating 
    var aggregate = getXpath("//div[@class='global-rating__rating']/text()", 'nodeValue');
    if( aggregate != null){
      if(aggregate.includes("/")){
        aggregate = aggregate.split("/")[0];
        aggregate = aggregate.replace(",",".");
        addElementToDocument('aggregate', aggregate);
      }
    }

    // @ts-ignore
    const brandText = window.dataLayer[0].ecommerce.detail.products[0].brand;
    addHiddenDiv('brandText', brandText);
    // @ts-ignore
    let listPrice = window.dataLayer[0].ecommerce.detail.products[0].price
    listPrice = listPrice + '€'
    addHiddenDiv('listPrice', listPrice);
    // @ts-ignore
    let availabilityText = window.dataLayer[0].ecommerce.detail.products[0].stock;
    if (availabilityText == 'lowStock') {
      availabilityText = 'In Stock'
    }
    if (availabilityText == 'inStock') {
      availabilityText = 'In Stock'
    }
    if (availabilityText == 'outOfStock') {
      availabilityText = 'Out Of Stock'
    }
    addHiddenDiv('availabilityText', availabilityText)
    // @ts-ignore
    const variantId = window.dataLayer[0].ecommerce.detail.products[0].variant;
    addHiddenDiv('variantId', variantId)
    // gtin
    try{
      const productInfo = document.getElementById('auditedOpinionsInfo').getAttribute('data-auditedopinionurl');
    const splitProductInfo = productInfo.split('&')
    console.log(splitProductInfo)
    const getGtin = splitProductInfo[5]
    const gtinData = getGtin.split('=')
    const gtinValue = gtinData[1]
    addHiddenDiv('gtinValue', gtinValue)
  }
  catch (error) {

  }
    
    try {
      const productInfo = document.querySelectorAll('#auditedOpinionsInfo')[0];
      if (productInfo.attributes[5].value !== '') {
        const splitProductInfo = productInfo.attributes[5].value.split('&')
        const getGtin = splitProductInfo[5]
        const gtinData = getGtin.split('=')
        const gtinValue = gtinData[1]
        addHiddenDiv('gtinValue', gtinValue)
      }
    }
    catch (error) {

    }


    // @ts-ignore
    //  let warningInfo="";
    //    // @ts-ignore
    //  if(document.getElementsByClassName('prodInfoTxtData')[1].textContent.includes("WARNING")){
    //   alert('hi')
    //   // @ts-ignore
    //    warningInfo = document.getElementsByClassName('prodInfoTxtData')[1].textContent
    //   addHiddenDiv('warningInfo', warningInfo);
    //  }
    //  else{
    //    warningInfo=""
    //    addHiddenDiv('warningInfo', warningInfo);
    //  }

  });


  return await context.extract(productDetails, { transform });
}


