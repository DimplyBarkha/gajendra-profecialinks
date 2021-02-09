const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'deonlinedrogist',
    transform: transform,
    domain: 'deonlinedrogist.nl',
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

      function stall(ms) {
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

      const jsonStr = getXpath("//script[@type='application/ld+json'][1]/text()",'nodeValue');
      console.log("jsonStr: ", jsonStr);
      if(jsonStr){
        const jsonObj = JSON.parse(jsonStr);
        var availabilityText = jsonObj.offers.availability;
        //console.log("availability: ",availabilityText.split('/')[3]);
        if((availabilityText.split('/')[3]) === "InStock"){
          var text = "In Stock";
        }
        if((availabilityText.split('/')[3]) === "OutOfStock"){
          var text = "Out Of Stock";
        }
        //console.log("Text:  ", text);
        addElementToDocument('added_availability_text',text);
      }

      const quantityxpath = getXpath("//div[@class='c-singleProduct__details']//ul[@class='c-singleProduct__options']/li[2]", 'innerText');
      console.log("quantityxpath : ", quantityxpath);
      if (quantityxpath != null) {
        const mpc = quantityxpath ? quantityxpath.split(':') : [];
        addElementToDocument('quantity', mpc[1]);
        console.log(mpc[1]);
      }

      const addDescxpath = getXpath(" //div[@class='c-product-description__accordioncontent']//div[not (@class='autheos-videothumbnail')]", 'innerText');
      if ((addDescxpath.substring(0, 2)) == "NL") {
        addElementToDocument('added_description_desc', addDescxpath.substring(2, addDescxpath.length));
      } else {
        addElementToDocument('added_description_desc', addDescxpath);
      }

      const gtinxpath = getXpath("//div[@class='c-singleProduct__details']//ul[@class='c-singleProduct__options']/li[3]", 'innerText');
      console.log("gtinxpath : ", gtinxpath);
      if (gtinxpath != null) {
        const gtin = gtinxpath ? gtinxpath.split(':') : [];
        addElementToDocument('gtin_added', gtin[1]);
        console.log(gtin[1]);
      }

      const add_desc = getXpath('//*[@id="j-product-full__content"]/div[1]/div[4]/div[1]/div/p[2]', 'innerText');
      console.log("additional Description is: ", add_desc);
      let length;
      if (add_desc == null || add_desc == " ") {
        length = 0;
        addElementToDocument('add_desc_bullet_count', length);
      }
      if (add_desc != null) {
        let descArray = add_desc.split("-");
        length = descArray.length;
        let actual_Bullet_points_count = length - 1;
        addElementToDocument('add_desc_bullet_count', actual_Bullet_points_count);
      }

      const priceXpathFirst = getXpath("//span[@class='c-singleProduct__price--new']/text()", 'nodeValue');
      const priceXpathSecond = getXpath("//span[@class='c-singleProduct__price--coins']/text()", 'nodeValue');
      const priceXpathFirstContent = priceXpathFirst.split(",")[0];
      const priceXpathDot = priceXpathFirstContent.concat(".");
      const priceXpath = priceXpathDot.concat(priceXpathSecond);
      addElementToDocument('priceXpath', priceXpath);

      const categoryXpath = getXpath("//div[@class='c-breadcrumbs']//span[@class='c-breadcrumbs__item link']/span/text()", 'nodeValue');
      addElementToDocument('categoryXpath', categoryXpath);
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};

