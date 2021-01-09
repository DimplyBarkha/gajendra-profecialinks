
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'lenstore',
    transform: null,
    domain: 'lenstore.it',
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

      function addHiddenDiv(id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('#productLeft > h1')[0];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }


      var script = getXpath('//form[@class="js-add-to-basket-form"]/following::script[2]/text()', 'nodeValue');

      //gtin
      if (script != null) {
        if (script.length > 120) {
          var data = JSON.parse(script);
          var gtin = data.gtin13;
          if (gtin != null) {
            addHiddenDiv("gtin", gtin);
            // addElementToDocument('gtin', gtin);
          }
        }
      }

      //rpc
      if (script.length > 120) {
        if (script.length > 120) {
          var data1 = JSON.parse(script);
          var rpc = data.productID;
          if (rpc != null) {
            addHiddenDiv("rpc", rpc);
            // addElementToDocument('rpc', rpc);
          }
        }
      }else{
        var zz = getXpath('//div[@class="o-outer c-main-wrapper"]/form/@data-product-details', 'nodeValue');
        var abc = JSON.parse(zz);
        var av = abc.code;
        addHiddenDiv("rpc", av);
      }



      // if(script != null){
      //   var zz =  script.split('availability": "')[1];
      //   zz = zz.split(",")[0];
      //   var arr = zz.split("/");
      //   zz = arr[arr.length-1];
      //   if(zz.includes("In")){
      //     zz = "In Stock"
      //   }else{
      //     zz = "Out of Stock"
      //   }
      //   if(zz != null){
      //     addElementToDocument('zz', zz);
      //   }
      // }

      //gtin
      // if(script != null){
      //   var gt = script.split('gtin13": "')[1];
      //   gt = gt.split(",")[0];
      //   gt = gt.slice(0,-1);
      //   if(gt != null){
      //     addElementToDocument('gt', gt);
      //   }
      // }

      // //rpc
      // if(script != null){
      //   var rpc = script.split('productID": "')[1];
      //   rpc = rpc.split(",")[0];
      //   rpc = rpc.slice(0,-1);
      //   if(rpc != null){
      //     addElementToDocument('rpc', rpc);
      //   }
      // }

      //description
      // 1. //h2[contains(text(),'Descrizione')]/text()
      // 2. //h2[contains(text(),'Descrizione')]/following::h3[1]/text()
      // 3. link :  //h2[contains(text(),'Descrizione')]/following::ul[1]/li/strong/text()
      // 3. value :  //h2[contains(text(),'Descrizione')]/following::ul[1]/li/text()


      var other = "";
      var oth = getXpath("//h2[contains(text(),'Descrizione')]/text()", 'nodeValue');
      if(oth != null){
        other = other + oth;
        var oth11 = getXpath("//h2[contains(text(),'Descrizione')]/following::h3[1]/text()", 'nodeValue');
      // for 2nd scenario
        var oth12 = getXpath("//h2[contains(text(),'Descrizione')]/following::p[1]/strong[contains(text(),'Vantaggi')]/text()", 'nodeValue');
        if(oth11 != null || oth12 != null){
          if(oth12 != null){
            oth11 = oth12;  
          }
          
          other = other + " "+ oth11;
        }

          //val
          var oth22 = getAllXpath("//h2[contains(text(),'Descrizione')]/following::ul[1]/li/text()", 'nodeValue');
          //link
          var oth33 = getAllXpath("//h2[contains(text(),'Descrizione')]/following::ul[1]/li/strong/text()", 'nodeValue');
          //for 2nd ser
          //val
          var oth23 = getAllXpath("//h2[contains(text(),'Descrizione')]/following::ul[1]/li/text()", 'nodeValue');
          //link
          var oth34 = getAllXpath("//h2[contains(text(),'Descrizione')]/following::ul[1]/li/strong/text()", 'nodeValue');

          //3rd sena



          if(oth22 != null){
            for(var i=0; i<oth22.length; i++){
              if(oth33.length >= 1){
                other = other  + " "+ oth33[i] + oth22[i];
              }else{
                other = other  + " "+ oth22[i];
              }
            }
          }else if(oth23 != null){
            for(var i=0; i<oth23.length; i++){
              other = other  + " "+ oth34[i] + oth23[i];
            }
          }
        
      }


      var desc = getAllXpath('//div[@class="c-product__related-content"]/p/text()', 'nodeValue');
      if (desc != null) {
        var str = "";
        for (var i = 0; i < desc.length; i++) {
          str = str + desc[i] + " ";
        }
        // addHiddenDiv("str", str);
        // addElementToDocument('str', str);
      }

      var final = other+" "+str;
      addHiddenDiv("str", final);

      //price
      var price = getXpath('//div[@id="purchaseBoxPricing"]/p/span/text()', 'nodeValue');
      if (price != null) {
        price = price.replace(",", ".");
        addHiddenDiv("price", price);
        // addElementToDocument('price', price);
      }

      // category
      var cat = getAllXpath("//strong[contains(text(),'Categorie')]/parent::td/following::td[1]/a/text()", 'nodeValue');             
      if (cat.length > 0) {
        for (var i = 0; i < cat.length; i++) {
          addHiddenDiv("cat", cat[i]);
          // addElementToDocument('cat', cat[i]);
        }
      } else {
        var cat2 = getXpath('//form[@class="js-add-to-basket-form"]/p/a[position()>1]/text()', 'nodeValue');
        addHiddenDiv("cat", cat2);
        // addElementToDocument('cat', cat2);
      }

      //name
      var name = getXpath('//div[@class="o-columns__item c-product u-half"]/h1/text()', 'nodeValue');
      if (name != null) {
        addHiddenDiv("name", name);
      }

      //image
      var image = getXpath('//picture[@class="c-product__figure"]/img/@src', 'nodeValue');
      if (image != null) {
        addHiddenDiv("image", image);
      }

        //image alt text
        var image_alt = getXpath('//picture[@class="c-product__figure"]/img/@alt', 'nodeValue');
        if (image_alt != null) {
          addHiddenDiv("image_alt", image_alt);
        }

      // nameExtended
      var nameExtended = getXpath('//div[@class="o-columns__item c-product u-half"]/h1/text()', 'nodeValue');
      if (nameExtended != null) {
        addHiddenDiv("nameExtended", nameExtended);
      }

      //availability
      var aval = getXpath('//span[@class="error u-error"]/text()', 'nodeValue');
      if (aval != null) {
        var availability = "Out of Stock"
        addHiddenDiv("availability", availability);
      } else {
        var availability = "In Stock"
        addHiddenDiv("availability", availability);
      }

      // brand
      var form = getXpath('//form[@class="js-add-to-basket-form"]/@data-product-details', 'nodeValue');
      //  var brand = getXpath("(//strong[contains(text(),' Marca ')]/parent::td/following::td/a/text())[1]", 'nodeValue');
      if (form != null) {
        var data = JSON.parse(form);
        var brand = data.brand;
        addHiddenDiv("brand", brand);
      }

      // ratingCount
      var ratingCount = getXpath('//p[@class="aggregateReviews"]/span[@class="aggrCount"]/span/text()', 'nodeValue');
      if (ratingCount != null) {
        addHiddenDiv("ratingCount", ratingCount);
      }

      // aggregateRating
      var aggregateRating = getXpath('//p[@class="aggregateReviews"]/span[@class="aggrRating"]/text()', 'nodeValue');
      if (aggregateRating != null) {
        addHiddenDiv("aggregateRating", aggregateRating);
      }

      // material
      var material = getXpath("//strong[contains(text(),'Materiale ')]/parent::td/following::td[1]/text()", 'nodeValue');
      if (material != null) {
        addHiddenDiv("material", material);
      }

      //numberOfServingsInPackage
      var serving = getXpath('//div[@class="o-columns__item c-product u-half"]/p[@class="c-product__duration u-zero-top"]/text()', 'nodeValue');
      if (serving != null) {
        var numberOfServingsInPackage = serving.split(" ")[0];
        if (numberOfServingsInPackage.includes("ml")) {
          numberOfServingsInPackage = numberOfServingsInPackage.replace("ml", "");
        }
        addHiddenDiv("numberOfServingsInPackage", numberOfServingsInPackage);
      }

      //specification
      var condition = getXpath('//*[contains(text(),"Dati dell\'Articolo:")]/text()', 'nodeValue');
      var keys = getAllXpath('//*[contains(text(),"Dati dell\'Articolo:")]/following::div[1]/table/tbody/tr[position()>0 and position()<last()]/td[@class="c-product-details__key"]/strong/text()', 'nodeValue');
      var cat_val = getAllXpath('//*[contains(text(),"Dati dell\'Articolo:")]/following::div[1]/table/tbody/tr[1]/td[@class="c-product-details__value"]/a/text()', 'nodeValue');
      var macra_val = getXpath('//*[contains(text(),"Dati dell\'Articolo:")]/following::div[1]/table/tbody/tr[2]/td[@class="c-product-details__value"]/a/text()', 'nodeValue');
      var other_val = getAllXpath('//*[contains(text(),"Dati dell\'Articolo:")]/following::div[1]/table/tbody/tr[position()>2 and position()<last()]/td[@class="c-product-details__value"]/text()', 'nodeValue');
      if (condition != null) {
        var specification = keys[0];
        for (var i = 0; i < cat_val.length; i++) {
          specification = specification + cat_val[i] +", ";
        }
        specification = specification.slice(0,-2);
        specification = specification +" "+ keys[1];
        specification = specification + macra_val;

        for (var i = 0; i < 4; i++) {
          specification = specification + keys[i + 2];
          specification = specification + other_val[i];
        }
        addHiddenDiv("specification", specification);
      }

      //bullet count 
      //div[@class="c-product__related-content"]//li/text() & //div[@class="c-product__related-content"]//li/a/strong/text()

      var bullet = getAllXpath('//div[@class="c-product__related-content"]//li/text()', 'nodeValue');
      var bullet_ex = getAllXpath('//div[@class="c-product__related-content"]//li/a/strong/text()', 'nodeValue');
      if(bullet.length >= 1){
        if(bullet_ex.length >= 1){
          bullet = bullet.concat(bullet_ex);
        }
        addHiddenDiv("bullet", bullet.length);
      }

    });
    await context.extract(productDetails);
  },
};