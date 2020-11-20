const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'filshill',
    transform: null,
    domain: 'filshill.co.uk',
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

      const saturatedUOM = getXpath("//table[@class='detailsTable']/tbody/tr/td/table/tbody/tr/td[contains(.,'saturates')]/following-sibling::td[1]",'innerText');
      console.log("saturatedfatuom: ", saturatedUOM);
      if(saturatedUOM != null  ){
        const sfatUOM = saturatedUOM ? saturatedUOM.match(/([\d\.]+)(.*)/) : [];
        addElementToDocument('sfat_uom',sfatUOM[2]);
        console.log(sfatUOM[1]);
        }

        const totfatUOM = getXpath("//table[@class='detailsTable']/tbody/tr/td/table/tbody/tr/td[contains(.,'Fat')]/following-sibling::td[1]",'innerText');
        console.log("totalfatuom: ", totfatUOM);
        if(totfatUOM != null  ){
          const tfat = totfatUOM ? totfatUOM.match(/([\d\.]+)(.*)/) : [];
          addElementToDocument('tfat_uom',tfat[2]);
          console.log(tfat[1]);
          }

          const totcarbUOM = getXpath("//table[@class='detailsTable']/tbody/tr/td/table/tbody/tr/td[contains(.,'Carbohydrate')]/following-sibling::td[1]",'innerText');
          console.log("totalcarbuom: ", totcarbUOM);
          if(totcarbUOM != null  ){
            const tcarb = totcarbUOM ? totcarbUOM.match(/([\d\.]+)(.*)/) : [];
            addElementToDocument('tcarb_uom',tcarb[2]);
            console.log(tcarb[1]);
            }


          const totsugarUOM = getXpath("//table[@class='detailsTable']/tbody/tr/td/table/tbody/tr/td[contains(.,'sugars')]/following-sibling::td[1]",'innerText');
          console.log("totalsugaruom: ", totsugarUOM);
          if(totsugarUOM != null  ){
            const tsuguom = totsugarUOM ? totsugarUOM.match(/([\d\.]+)(.*)/) : [];
            addElementToDocument('tsugar_uom',tsuguom[2]);
            console.log(tsuguom[1]);
            }


          const totproteinUOM = getXpath("//table[@class='detailsTable']/tbody/tr/td/table/tbody/tr/td[contains(.,'Protein')]/following-sibling::td[1]",'innerText');
          console.log("totalproteinuom: ", totproteinUOM);
          if(totproteinUOM != null  ){
            const tprotienuom = totproteinUOM ? totproteinUOM.match(/([\d\.]+)(.*)/) : [];
            addElementToDocument('tprotien_uom',tprotienuom[2]);
            console.log(tprotienuom[1]);
            }

          const totsaltUOM = getXpath("/html/body/table/tbody/tr/td[2]/div/table[5]/tbody/tr[2]/td/table/tbody/tr[3]/td[2]",'innerText');
          console.log("totalsaltuom: ", totsaltUOM);
          if(totsaltUOM != null  ){
            const tsaltuom = totsaltUOM ? totsaltUOM.match(/([\d\.]+)(.*)/) : [];
            addElementToDocument('tsalt_uom',tsaltuom[2]);
            console.log(tsaltuom[1]);
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
  
   });
  await context.extract(productDetails, { transform: transformParam });
  },
};
