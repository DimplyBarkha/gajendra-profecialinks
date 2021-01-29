// const { cleanUp } = require("@library/product/details/shared");
const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'lloydspharmacy',
    transform: cleanUp,
    domain: 'lloydspharmacy.com',
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

      //desc
      var ul = getAllXpath('//div[@class="product-description__key-features-container"]/ul/li/text()', 'nodeValue');
      var head = getXpath('//h2[contains(text(),"Product description")]/text()', 'nodeValue');
      var p1 = getXpath('//h2[contains(text(),"Product description")]/following::p[position()<3]/b/text()', 'nodeValue');
      var p2 = getXpath('//h2[contains(text(),"Product description")]/following::p[position()<3]/text()', 'nodeValue');
      var features = getXpath('//h2[contains(text(),"Product description")]/following::p[position()<3]/following::h3[1]/text()', 'nodeValue');
      var ul2 = getAllXpath('//h2[contains(text(),"Product description")]/following::p[position()<3]/following::h3[1]/following::ul[1]/li/text()', 'nodeValue');
      var final = "";
      if(ul.length >= 1){
        for(var i=0; i<ul.length; i++){
          final = final + " "+ ul[i];
        }
      }
      if(head != null){
        final = final + " "+ head;
      }
      if(p1 != null){
        final = final + " "+ p1;
      }
      if( p2 != null){
        final = final + " "+ p2;
      }
      if(features != null){
        final = final + " "+ features;
      }
      if(ul2.length >= 1){
        for(var i=0; i<ul2.length; i++){
          final = final + " "+ ul2[i];
        }
      }
      if(final.length >= 1){
        addElementToDocument('final', final);
      }

      //bullet count
      //div[@class="product-description__key-features-container"]/ul/li/text()
      //h3[contains(text(),"Features of")]/following::ul[1]/li/text()
      // count(//div[@class="product-description__key-features-container"]/ul/li | //h3[contains(text(),"Features of")]/following::ul[1]/li)
      var bullet1 = [];
      if(ul.length >= 1){
        for(var i=0; i<ul.length; i++){
          ul[i] = ul[i].trim();
        }
        for(var i=0; i<ul.length; i++){
          if(ul[i].length > 1){
            bullet1.push(ul[i])
          }
        }
      }
      if(ul2.length >= 1){
        for(var i=0; i<ul2.length; i++){
          ul2[i] = ul2[i].trim();
        }
        for(var i=0; i<ul2.length; i++){
          if(ul2[i].length > 1){
            bullet1.push(ul2[i])
          }
        }
      }
      if(bullet1.length >= 1){
        var count = bullet1.length;
        addElementToDocument('count', count);
      }

      
      //bullet info 
      var de = getAllXpath("//h3[contains(text(),'Features of')]/following::ul[1]/li/text()", 'nodeValue');
      if(de != null){
        var bullet = de.join(" || ");
        addElementToDocument('bullet', bullet);
      }

      //warning
      var wa = getAllXpath("(//h4[contains(text(),'Warnings and cautions')]/following::div[1]/div/ul/li/text() | //h4[contains(text(),'Warnings and cautions')]/following::div[1]/div/ul/li/span/text()) | //h4[contains(text(),'Warnings and cautions')]/following::div[1]/div/text()", 'nodeValue');
      if(wa != null){
        var warning = wa.join(" ");
        addElementToDocument('warning', warning);
      }

      // sku
      var script = getXpath('(//head//script[@type="application/ld+json"])[1]/text()', 'nodeValue');
      if(script != null){
        var data = JSON.parse(script);
        var sku = data.sku;
        if(sku != null){
          addElementToDocument('sku', sku);
        }
      }

      //brand
      if(script != null){
        var brand = data.brand.name;
        if(brand != null){
          addElementToDocument('brand', brand);
        }
      }

      // size 
      var size = getAllXpath('(//h4[contains(text(),"Specifications")]/following::div[@class="accordion__body"]/div[@class="accordion__body-inner rte"])[1]/ul/li/text() | (//h4[contains(text(),"Specifications")]/following::div[@class="accordion__body"]/div[@class="accordion__body-inner rte"])[1]/p/text()', 'nodeValue');
      var quantity = "";
      if( size.length >= 1){
        for(var i=0; i<size.length; i++){
          quantity = quantity + size[i] + " ";
        }
        addElementToDocument('quantity', quantity.trim());
      }

      //alt imag
      var alt = getAllXpath('(//div[@class="slideInner___2mfX9 carousel__inner-slide"]/div/img)[position()>1]/@src', 'nodeValue');
      var altimg = "";
      if(alt.length >=1){
        for(var i=0; i<alt.length; i++){
          alt[i] = "https:"+alt[i];
        }
        altimg=alt.join("|");
        addElementToDocument('altimg', altimg);
      }


      // direction
      var direction = "";
      var title = getXpath('//h4[contains(text(),"How to use")]/following::div[1]/div/p/b/text()', 'nodeValue');
      if(title != null){
        direction = direction + title;
      }
      var dir = getAllXpath('//h4[contains(text(),"How to use")]/following::div/div/ol/li/text()', 'nodeValue');
      if(dir.length >= 1){
        for(var i=0; i<dir.length; i++){
          direction = direction+" "+dir[i];
        }
        // addElementToDocument('direction', direction);
      }
      if(direction.length >= 1){
        addElementToDocument('direction', direction);
      }
      

      //availability
      var aval = getXpath('//div[@class="product__stock-status product__svg-container"]/text()', 'nodeValue');
      if(aval != null){
        if(aval.includes("In stock")){
          aval = "In Stock"
        }else{
          aval = "Out of Stock"
        }
        addElementToDocument('aval', aval);
      }

      //price 
      var pr = getAllXpath('//div[@class="product__price"]/span/text()', 'nodeValue');
      if(pr.length >= 1){
        var price = "";
        if(pr[1] != undefined){
          price = pr[0] + " "+pr[1];  
        }else{
          price = pr[0]; 
        }
        // var price = pr[0] + " "+pr[1];
        addElementToDocument('price', price);
      }

      //rpc
      // @ts-ignore
      var rpc = meta.product.variants[0].id;
      if( rpc != undefined){
        addElementToDocument('rpc', rpc);
      }



    });
    await context.extract(productDetails);
  },
};