const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'filshill',
    transform: cleanUp,
    domain: 'filshill.co.uk',
    zipcode: '',
  },
  implementation: async ( inputs , { country, domain, transform: transformParam }, context, { productDetails }) => {
    const availability = await context.evaluate(async (inputs) => {
      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };

      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        return document.body.appendChild(catElement);
      }

      const availabilityTextValue = getXpath("//table[@class='ProductBox']/tbody/tr/td/div[contains(text(),"+inputs.id+")]/preceding-sibling::div/span/text()", 'nodeValue');
      console.log('inputId2',inputs.id);
      console.log('availability',availabilityTextValue);
      if(availabilityTextValue == 'In Stock'){
        return 'In Stock';
      } else {
        return 'Out of Stock';
      } 
    //  return 'https://sales.filshill.co.uk/products/ProdDetails.asp?product_code='+inputs.id+'&list=undefined';
    },inputs);

    const productUrl = 'https://sales.filshill.co.uk/products/ProdDetails.asp?product_code='+inputs.id+'&list=undefined';
    console.log(availability);
    try {
      await context.goto(productUrl);
    } catch (error) {
      console.log('No record');
    }
    async function loadResources () {
      await context.setAntiFingerprint(false);
      await context.setLoadAllResources(true);
      await context.setBlockAds(false);
    }
    await loadResources();
   
    await context.evaluate(async (availability,productUrl) => {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }

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

      addElementToDocument('availability_added',availability);
      addElementToDocument('product_url',productUrl);

      const saturatedUOM = getXpath("//table[@class='detailsTable']/tbody/tr/td/table/tbody/tr/td[contains(.,'saturates')]/following-sibling::td[1]",'innerText');
      console.log("saturatedfatuom: ", saturatedUOM);
      if(saturatedUOM != null  ){
        const sfatUOM = saturatedUOM ? saturatedUOM.match(/([\d\.]+)(.*)/) : [];
        if(sfatUOM.length > 0){
          addElementToDocument('sfat_uom',sfatUOM[2]);
          addElementToDocument('sfat',sfatUOM[1]);
          console.log(sfatUOM[1]);
          }
        }

        const totfatUOM = getXpath("//table[@class='detailsTable']/tbody/tr/td/table/tbody/tr/td[contains(.,'Fat')]/following-sibling::td[1]",'innerText');
        console.log("totalfatuom: ", totfatUOM);
        if(totfatUOM != null  ){
          const tfat = totfatUOM ? totfatUOM.match(/([\d\.]+)(.*)/) : [];
            if(tfat != null ){
              addElementToDocument('tfat_uom',tfat[2]);
              addElementToDocument('tfat',tfat[1]);
              console.log(tfat[1]);
            }
          }

          const totcarbUOM = getXpath("//table[@class='detailsTable']/tbody/tr/td/table/tbody/tr/td[contains(.,'Carbohydrate')]/following-sibling::td[1]",'innerText');
          console.log("totalcarbuom: ", totcarbUOM);
          if(totcarbUOM != null  ){
            const tcarb = totcarbUOM ? totcarbUOM.match(/([\d\.]+)(.*)/) : [];
            if(tcarb != null ){
              addElementToDocument('tcarb_uom',tcarb[2]);
              addElementToDocument('tcarb',tcarb[1]);
              console.log(tcarb[1]);
            }
            }


          const totsugarUOM = getXpath("//table[@class='detailsTable']/tbody/tr/td/table/tbody/tr/td[contains(.,'sugars')]/following-sibling::td[1]",'innerText');
          console.log("totalsugaruom: ", totsugarUOM);
          if(totsugarUOM != null  ){
            const tsuguom = totsugarUOM ? totsugarUOM.match(/([\d\.]+)(.*)/) : [];
            if(tsuguom != null ){
              addElementToDocument('tsugar_uom',tsuguom[2]);
              addElementToDocument('tsugar',tsuguom[1]);
              console.log(tsuguom[1]);
            }
            }


          const totproteinUOM = getXpath("//table[@class='detailsTable']/tbody/tr/td/table/tbody/tr/td[contains(.,'Protein')]/following-sibling::td[1]",'innerText');
          console.log("totalproteinuom: ", totproteinUOM);
          if(totproteinUOM != null  ){
            const tprotienuom = totproteinUOM ? totproteinUOM.match(/([\d\.]+)(.*)/) : [];
            if(tprotienuom != null ){
              addElementToDocument('tprotien_uom',tprotienuom[2]);
              addElementToDocument('tprotien',tprotienuom[1]);
              console.log(tprotienuom[1]);
            }
            }

          const totsaltUOM = getXpath("//table[@class='detailsTable']/tbody/tr/td/table/tbody/tr/td[contains(.,'Salt')]/following-sibling::td[1]",'innerText');
          console.log("totalsaltuom: ", totsaltUOM);
          if(totsaltUOM != null  ){
            const tsaltuom = totsaltUOM ? totsaltUOM.match(/([\d\.]+)(.*)/) : [];
            if(tsaltuom != null ) {
              addElementToDocument('tsalt_uom',tsaltuom[2]);
              addElementToDocument('tsalt',tsaltuom[1]);
              console.log(tsaltuom[1]);
            }
            }
            
            const priceXpath = getXpath("/html/body/table/tbody/tr/td[1]/table[1]/tbody/tr[2]/td[2]",'innerText');
            console.log("priceXpath: ", priceXpath);
            if(priceXpath != null  ){
              const priceValue = priceXpath ? priceXpath.split('(') : [];
              if(priceValue != null) {
              addElementToDocument('price_added',priceValue[0]);
              console.log(priceValue[0]);
              }
              }     

          const queryString = window.location.search;
          const urlParams = new URLSearchParams(queryString);
          const productCode = urlParams.get('product_code');
          console.log(productCode);
          addElementToDocument('productcode_added',productCode);  


          const prodName = getXpath("/html/body/table/tbody/tr/td[1]/center/b",'innerText');
          console.log("product name: ", prodName);
          if(prodName != null  ){
            addElementToDocument('product_name',prodName);
            }
  
   },availability,productUrl);
  await context.extract(productDetails, { transform: transformParam });
  },
};