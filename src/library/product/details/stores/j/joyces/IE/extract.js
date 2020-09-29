
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IE',
    store: 'joyces',
    transform: null,
    domain: 'joyces.ie',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
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
      if (element) result.push(prop ? element[prop] : element.nodeValue);        }     
      return result; 
      };
    
      const manufacturerDescription_xpath = "//div[@class='flix-Text-block']";
      const manufacturerDescription = getAllXpath(manufacturerDescription_xpath, 'innerText');
      console.log(manufacturerDescription);
      addElementToDocument('added_manufacturerDescription', manufacturerDescription);
     
      const weightNet_xpath = "//div[@class='eky-specs-container'][1]//p[@class='eky-specs-label-bottom']";
      const weightNet = getAllXpath(weightNet_xpath, 'innerText');
      console.log(weightNet);
      addElementToDocument('added_weightNet', weightNet);

      const shippingSpecification = document.querySelectorAll('.inpage_selector_specification .flix-std-table .flix-std-specs-table .flix-title');
      let dimension="";
      let weight="";
      shippingSpecification.forEach((item)=>{
        if(item.textContent.includes("kg")){
          weight=item.textContent;
          addElementToDocument('product_weight',weight);
        }else if(item.textContent.includes("mm")){
          dimension+=item.textContent +"X";
        }
      });
      dimension=dimension.slice(0,-1);
      addElementToDocument('product_dimension',dimension);
 
      if(weight==""){
          const shippingWeight = document.querySelectorAll('.inpage_selector_specification .flix-std-specs-table .flix-title');
 
          shippingWeight.forEach((item)=>{
          if(item.textContent.includes("KG") || item.textContent.includes("kg")){
          weight=item.textContent;
          }
          });
          addElementToDocument('product_weight',weight);
      }
      let scrollTop = 500;
      while (true) {
      window.scroll(0, scrollTop);
      await stall(1000);
      scrollTop += 500;
      if (scrollTop === 10000) {
      break;
      }
      }
    
      // if (product_name && product_name.value.indexOf('|') > -1) {
      //   const mpc = product_name.value.slice(product_name.value.indexOf('|') + 1);
      //   console.log(mpc);
      //   addElementToDocument('added_mpc', mpc[1]);
      // }
      

      // if (colorlement && colorlement.value.indexOf('background-color') > -1) {
      //   const colorCode = colorlement.value.slice(colorlement.value.indexOf('#') + 1);
      //   addElementToDocument('fl_colorcode', colorCode);
      // }

    });
    await context.extract(productDetails);
  },
};



  

 
