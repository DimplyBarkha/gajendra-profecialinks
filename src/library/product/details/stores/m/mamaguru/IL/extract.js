
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IL',
    store: 'mamaguru',
    transform: null,
    domain: 'mamaguru.co.il',
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

      const tab_content = getXpath("//div[@class='TabContent']", 'innerText');

      if(tab_content){
        
        if(tab_content.includes("משקל")){
          const weight_substring = tab_content.substring(tab_content.indexOf("משקל"), tab_content.indexOf("\n", tab_content.indexOf("משקל")));
          addElementToDocument('added_weight', (weight_substring.split(/[-:]+/))[1]);
        }

        if(tab_content.includes("מידות")){
          const shipping_dimensions = tab_content.substring(tab_content.indexOf("מידות"), tab_content.indexOf("\n", tab_content.indexOf("מידות")));
          addElementToDocument('added_shipping_dimensions', (shipping_dimensions.split(/[-:]+/))[1]);
        }

        if(tab_content.includes("צבע")){
          const color = tab_content.substring(tab_content.indexOf("צבע"), tab_content.indexOf("\n", tab_content.indexOf("צבע")));
          addElementToDocument('added_color', (color.split(/[-:]+/))[1]);
        }
      }

      const specification_text = getXpath("//div[@class='TabContent']//p//strong[contains(text(), 'מפרט טכני')]/following::ul", 'innerText');
      if(specification_text){
        addElementToDocument('added_specifications', specification_text.split("\n").join(" || "));
      }

      // get the json object
      const jsonStr =  getXpath("//script[@type='application/ld+json']/text()", 'nodeValue');
      if(jsonStr){
        const jsonObj = JSON.parse(jsonStr);
        addElementToDocument('added_mpn', jsonObj.mpn);
        if(jsonObj.aggregateRating){
          addElementToDocument('added_aggregate_rating', jsonObj.aggregateRating.ratingValue);
        }       
      }

      const warranty_text = getXpath("//div[@class='R WarrantyText']/p","innerText");
      if(warranty_text){
        const warranty_subtext = warranty_text.split(" ");
        warranty_subtext.forEach(text => {
          if(text.includes("שנת")){
            addElementToDocument('added_warranty', text);
          }        
        });
      }
      const technical_information_pdf_present = getXpath("(//a[contains(concat(' ',normalize-space(@href),' '),'.pdf')])[1]","innerText"); 
      if(technical_information_pdf_present){
        addElementToDocument('added_technical_information_pdf_present', 'Yes');
      }
    });
    await context.extract(productDetails);
  },

};
