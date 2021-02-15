
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'otto-office',
    transform: null,
    domain: 'otto-office.com',
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
      function addHiddenDiv1(id, content, index) {
        const newDiv = document.createElement("div");
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = "none";
        const originalDiv = document.querySelectorAll('h1[id="oo-block-hl"]')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
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
      // var spec = getAllXpath('//ul[@class="ooB-mb24 bullet ooX-fs14 "]/li/text()', 'nodeValue');
      // if (spec != null) {
      //   var str = spec.join(" || ");
      //   addElementToDocument('str', str);
      // }
      var avl = getXpath('//button[@class="ooB-mb6 ooB-w100 ooBtn ooBtn-green ooBtn-arrow-right btn-add-to-basket"]/text()', 'nodeValue');
      if (avl != null) {
        avl = "In Stock"
        addElementToDocument('avl', avl);
      } else {
        avl = "Out Of Stock"
        addElementToDocument('avl', avl);
      }
      try {
        var price = getXpath('//div[@class="preis_gelb_links"]/p/span[1] | //div[@class="oo-pricelabel_price"]/p/span[1]/span[position()>1 and position()<4]/text()', 'nodeValue');
        if (price != null) {
          for (var i = 0; i < price.length; i++) {
            var price1 = price[i].replace(",", ".");
            addHiddenDiv1("price", price1, i);
          }
        }
        const URL = window.location.href;
        try {
          document.getElementById("pd_url").remove();
        } catch (error) { }
        addElementToDocument("pd_url", URL);
      }
      // @ts-ignore
      // @ts-ignore
      catch (error) {
      }
      //specification
      try {
        var spec1 = getAllXpath('//span[contains(text(),"Eigenschaften ")]/parent::h2/following::div[1]/table/tbody/tr/td/span/text()', 'nodeValue');
        var spec2 = getAllXpath('//span[contains(text(),"Eigenschaften ")]/parent::h2/following::div[1]/table/tbody/tr/td/text()', 'nodeValue');
        if (spec1.length >= 1) {
          var arr = [];
          for (var i = 0; i < spec2.length; i++) {
            arr[i] = spec2[i].trim();
          }
          var wife = [];
          for (var i = 0; i < arr.length; i++) {
            if (arr[i].length >= 1) {
              wife.push(arr[i])
            }
          }
          var husband = [];
          for (var i = 0; i < spec1.length; i++) {
            husband[i] = spec1[i].trim();
          }
          var final = ""
          for (var i = 0; i < husband.length; i++) {
            final = final + " " + husband[i] + " " + wife[i];
            if (i + 1 < husband.length) {
              final = final + " || "
            }
          }
          addElementToDocument("final", final);
        }
      }
      catch (e) {

      }
      //URL
      try {
        var url = getXpath('//div[@class="inner_content"]/script[@type="application/ld+json"]/text()', 'nodeValue');
        if (url.length >= 1) {
          var data = JSON.parse(url);
          if (typeof (data) == "object") {
            var URL = data.offers.url;
            URL = URL.split("?wkid")[0];
            addElementToDocument("URL", URL);
          }
        }
      }
      catch (e) {

      }
      //SKU
      var sku = getXpath('//figure[@id="image-preview-container"]/img/@src', 'nodeValue');
      sku = sku.replace(/(.+ART_)(\d+)(([A-Z]+)?)(_+.+)/g, '$2$3');
      addElementToDocument("sku", sku);
      //Aggregate rating
      var aggrating = getXpath('//div[@class="rating-stars-copy"]/text()', 'nodeValue');
      if (aggrating != null) {
        aggrating = aggrating.split(" ")[0];
        aggrating = aggrating.replace(".", ",")
        addElementToDocument("aggrating", aggrating);
      }
      //description
      var head = getXpath('//section[@id="product_description"]/h2/span/text()', 'nodeValue');
      var p = getAllXpath('//div[@class="ooB-mb12 ads_default_ullifix"]/p/text()', 'nodeValue');
      var para = ""
      if (p.length >= 1) {
        for (var i = 0; i < p.length; i++) {
          if (p[i].includes("Maße (")) {
            continue;
          } else {
            para = para + p[i];
          }
        }
      }
      var li = getAllXpath('//div[@class="ooB-mb12 ads_default_ullifix"]//ul/li/text()', 'nodeValue');
      if (li.length >= 1) {
        var bullet = li.join(" || ");
      }
      var add_desc = head + " " + para + " || " + bullet;
      if (add_desc.length >= 1) {
        addElementToDocument("add_desc", add_desc);
      }

      //varinatcount
      var variantcount = getAllXpath('//div[@id="item-color-choice-container"]/a/@href', 'nodeValue');
      var count = variantcount.length;
      addElementToDocument("count", count);

      //brand

      var scriptdata = getXpath("//script[@type='application/ld+json']/text()", 'nodeValue');
      if (scriptdata.length >= 50) {
        var json_data = JSON.parse(scriptdata)
        if (json_data != null) {
          var brand = json_data.brand.name;
          addElementToDocument("brand", brand);
          // addElementToDoc(,,,,)
        }
      }

      //additional dec bullets
      var addbul = getAllXpath('//ul[@class="bullet"]/li/text()', 'nodeValue');
      if (addbul != null) {
        var str = addbul.join(" || ");
        addElementToDocument('str', str);
      }

      //variants
      //   var vari = getXpath('//div[@class="content-overflow"]/script[2]/text()';, 'nodeValue');

      // var img = vari.split('variant')[1]
      // var img = img.split("',")[0]
      // var img = img.slice(4)
      // addElementToDocument('variant', img);
      //variants

      var data1 = getAllXpath('//div[@id="item-color-choice-container"]/a/@data-oo_rh_master_state', 'nodeValue');
      var varinats = "";
      var first_variant = "";
      if (data1.length >= 1) {
        for (var i = 0; i < data1.length; i++) {
          var temp = JSON.parse(data1[i]);
          varinats = varinats + temp.color_code;
          if (i + 1 < data1.length) {
            varinats = varinats + " | ";
          }
          first_variant = (JSON.parse(data1[0])).color_code;
        }
      } else {
        var data2 = getAllXpath('//div[@class="ooG ooB-mb20 ooG-tc-6 bundle-container bundle-container-buttons ccP-article-grouping"]/div/a/text()', 'nodeValue');
        if (data2.length >= 1) {
          for (var i = 0; i < data2.length; i++) {
            varinats = varinats + data2[i];
            if (i + 1 < data2.length) {
              varinats = varinats + " | ";
            }
            first_variant = data2[0];
          }
        }
      }
      if(first_variant.length){
        addElementToDocument('first_variant', first_variant);
        }
        if(varinats.length){
          addElementToDocument('varinats', varinats);
          }




    });
    await context.extract(productDetails);
  },
};