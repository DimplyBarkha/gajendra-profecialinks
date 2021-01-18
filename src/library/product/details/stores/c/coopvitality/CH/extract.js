
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'coopvitality',
    transform: null,
    domain: 'coopvitality.ch',
    zipcode: '',
  },
  implementation: async ({ inputstring }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(() => {
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      // @ts-ignore
      const brand = window.dlObjects[0].ecommerce.detail.products[0].brand;
      addElementToDocument('brand', brand);

      // @ts-ignore
      const category = window.dlObjects[0].ecommerce.detail.products[0].category;
      var z = category.split("/");
      var len = z.length;
      for (let i=0 ; i<len; i++){
        addElementToDocument('category', z[i]);
      }
     
      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };

      var getXpath = (xpath, prop) => {
        var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };

      var name = getXpath('//span[@data-ui-id="page-title-wrapper"]/text()', 'nodeValue');
      if (name != null){
        var abc = name.split(" ");
        var zz = abc.slice(Math.max(abc.length - 2, 1))
        zz = zz.join(" ")
        addElementToDocument('zz', zz);
      }


// description
      var dec = getAllXpath('//div[@class="product attribute description"]/div/div/text()', 'nodeValue');
      var res = "";
      if ( dec != null){
         res = dec.join(" ");
         addElementToDocument('res', res);
      }

      var dec1 = getAllXpath('//div[@class="prescriptionProductInfo"]/p/text()', 'nodeValue');
      if( dec1 != null){
        res = dec1.join(" ");
        addElementToDocument('res', res);
      }

      var dec2 = getXpath('//p[@class="MsoNormal"]/span/text()', 'nodeValue');
      if( dec2 != null){
        res = dec2;
        addElementToDocument('res', res);
      }

      var dec3 = getXpath('//p[@class="MsoNormal"]/text()', 'nodeValue');
      if ( dec3 != null){
        res = dec3;
        addElementToDocument('res', res);
      }
      
      var rat = getXpath('//div[@class="redirect-to-review-details rating-summary reviews-actions"]/a/div/@title', 'nodeValue');
      var rating = 1;
      if(rat != null){
        if( rat.includes("%") ){
          rating = rat.slice(0,-1);
          rating = (rating*5)/100;
          addElementToDocument('rating', rating);
        }
      }

      var ppu = 0;
      addElementToDocument('ppu', ppu);


      var sec = getAllXpath('//div[@class="fotorama__nav__frame fotorama__nav__frame--thumb"]/div/img/@src', 'nodeValue');
      if( sec.length >= 1){
        for(var i=0; i<sec.length; i++){
          addElementToDocument('sec', sec[i]);
        }
      }


      // availability
      var aval = getXpath('//script[@type="application/ld+json"]/text()', 'nodeValue');
      if(aval != null){
        var data = JSON.parse(aval);
        var availability = data.offers.availability;
        if(availability != null){
          availability = availability.split("org/")[1];
          if(availability.includes("InStock")){
            availability = "In Stock";
          }else{
            availability = "Out of Stock"
          }
        addElementToDocument('availability', availability);
        }
      }


      //image
      var image = getXpath('(//div[@class="fotorama__stage__frame fotorama__active fotorama_vertical_ratio fotorama__loaded fotorama__loaded--img"]/img)[1]/@src', 'nodeValue');
      if(image != null){
        image = image.replace("9d08971813a040f8f96067a40f75c615","030716fc62035027b622eeef186d3d67");
        addElementToDocument('image', image);
      }

      

    });
    await context.extract(productDetails);
  },
};
