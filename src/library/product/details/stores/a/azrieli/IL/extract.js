const { transform } = require('./transform');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IL',
    store: 'azrieli',
    transform,
    domain: 'azrieli.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      // var a=document.querySelector('#finePrint').childNodes;
       //console.log("here is nodes",a);
      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
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

      const alternateImages = getAllXpath("//div[@id='offer-bg']//div[@id='offerImges']/div[position()>1]/img/@src", 'nodeValue').join(' | ');
      console.log('alternateImages   ' + alternateImages);
      addElementToDocument('added_alternateImages', alternateImages);

      const variantId = getXpath("//meta[@property='og:url']", 'content');
      const variantIdValue = variantId.split('/')[4];
      addElementToDocument('added_variantId', variantIdValue);

      const sku = getXpath("//meta[@property='og:url']", 'content');
      const skuValue = sku.split('/')[4];
      addElementToDocument('added_sku', skuValue);

      let listPrice = getXpath("//div[@id='DealValueWrap']", 'innerText');
      console.log('listPrice ', listPrice);
      let listPriceValue;
      if (listPrice != null) {
        listPrice = listPrice.replace(/\r\n|\r|\n/g, ' ');
        listPriceValue = listPrice.split('')[1] + listPrice.split('')[0];
      }

      addElementToDocument('added_listPrice', listPriceValue);

      const price = getXpath("//div[@class='deal-price']//div[@style='float:right;']", 'innerText').replace(/\r\n|\r|\n/g, ' ');
      const priceValue = price.split('')[1] + price.split('')[0];
      addElementToDocument('added_price', priceValue);

      const specifications = getAllXpath("//div[@class='finePrint']/descendant::strong[text()='מפרט טכני']/following::div/ul//li//text() | //div[@class='finePrint']/descendant::strong[text()='מפרט טכני']/following::ul[1]//li//text() | //div[@class='finePrint']/descendant::strong[text()='מפרט טכני:']/following::text()[position()<9] | //div[@class='finePrint']/descendant::strong[text()='מפרט טכני:']/following::div[position()<9]", 'nodeValue').join('|');
      addElementToDocument('added_specifications', specifications);

       const getInTheBoxx = document.querySelector('.finePrint').children;
       let startFlag =false;
       var setBoxHere = "" ;
       for(let i =0; i< getInTheBoxx.length; i++)
       {
         if(getInTheBoxx[i].textContent.includes("פרטים נוספים")){
          startFlag=false;
         }
        if(startFlag == true){
          setBoxHere += getInTheBoxx[i].textContent;
        }
        if(getInTheBoxx[i].textContent == "הערכה כוללת:"){
          startFlag=true;
         }
       }
      addElementToDocument(`inTheBoxTextHere`,setBoxHere);

      const getInTheBox = document.querySelector('.finePrint').children;
       let start =false;
       var setBox = "" ;
       for(let i =0; i< getInTheBox.length; i++)
       {
         if(getInTheBox[i].textContent.includes("מפרט טכני")){
          start=false;
         }

        if(start == true){
          setBox += getInTheBox[i].textContent;
        }

        if(getInTheBox[i].textContent == "אביזרים:"){
          start=true;
         }
       }
      addElementToDocument(`inTheBoxText`,setBox);

      let netWeight = getXpath("//div[@class='finePrint']//p/text()[preceding-sibling::br and contains(.,'משקל') and not(contains(.,'קל-משקל'))] | //div[@class='finePrint']//p//following-sibling::ul[@dir='rtl']//li/text()[contains(.,'משקל')] | //div[@class='finePrint']//div//ul//li/text()[contains(.,'משקל')] | //div[@class='finePrint']//div/text()[contains(.,'משקל כולל:')]", 'nodeValue');
      if (netWeight != null && netWeight.includes(':')) {
        netWeight = netWeight.split(':')[1];
      } else if (netWeight != null && netWeight.includes('-')) {
        netWeight = netWeight.split('-')[1];
      } else if (netWeight != null && netWeight.includes('משקל')) {
        netWeight = netWeight.replace('משקל', '');
      }
      addElementToDocument('added_netWeight', netWeight);

      let technicalDoc = getXpath("//div[@class='PsoletMessage']//a[contains(@href,'https')]/@href", 'nodeValue');
      console.log('technicalDoc   ' + technicalDoc);
      if (technicalDoc != null && technicalDoc.includes('https')) {
        technicalDoc = 'Yes';
      } else {
        technicalDoc = 'No';
      }

      let allProducts = document.querySelectorAll('div[data-container-type="similarDealsContainer"] a');
      const prod = [];
      [...allProducts].forEach((element) => {
        const brand = element.querySelector('span.attValueOfferBox') ? element.querySelector('span.attValueOfferBox').innerText : '';
        const title = element.querySelector('.title-link') ? element.querySelector('.title-link').innerText : '';
        prod.push(brand + ' ' + title);
      });

      addElementToDocument('added_UPDP', prod.join(' || '));

      addElementToDocument('added_technicalDoc', technicalDoc);

      addElementToDocument('added_variantCount', 0);


    });
    await context.extract(productDetails, { transform: transformParam });
  },
};
