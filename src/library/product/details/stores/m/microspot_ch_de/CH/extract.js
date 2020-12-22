
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'microspot_ch_de',
    transform: null,
    domain: 'microspot.ch',
    zipcode: '',
  },
  implementation: async ({ inputstring }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async () => {
      // @ts-ignore
      document.querySelector('div[class="_3BsNnh"]').click()
      await new Promise(r => setTimeout(r, 6000));

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

      // function to remove duplicates from array
      function uniq(a) {
        var seen = {};
        return a.filter(function (item) {
          return seen.hasOwnProperty(item) ? false : (seen[item] = true);
        });
      }

        // removing duplicates url from alternateImage
        // var alt = getAllXpath('(//div[@class="_165CLk"]/img/@src)[position()>1]', 'nodeValue');
        // if (alt != null) {
        //   var altImg = uniq(alt);
        //   addElementToDocument('altImg', altImg);
        // }

        // removing duplicates url from alternateImage
        var alt = getAllXpath('(//div[@class="_165CLk"]/img/@src)[position()>1]', 'nodeValue');
        if (alt != null) {
          var altImg = uniq(alt);
          altImg.pop();
          var len = altImg.length;
          addElementToDocument('len', len);
          // if(altImg.length > 1 ){
            var sec_img = altImg.join(" | ");
          addElementToDocument('sec_img', sec_img);
          // }
        }

        //specication
        var css1 = document.querySelectorAll('div[data-test-1="true"]>div[class="_1k-W7f"]>table>tbody>tr');
        if(css1 != null){
          var final_spec = "";
          for(var i=0; i<css1.length; i++){
            for(var j=0; j<2; j++){
              final_spec = final_spec + css1[i].childNodes[j].textContent;
              if(j%2 == 1){
                final_spec = final_spec + " || ";
              }else{
                final_spec = final_spec + ":";
              }
            }
          }
          final_spec = final_spec.slice(0,-3);
          addElementToDocument('final_spec', final_spec);
        }

        // aggregateRating 
        var txt = getXpath('//script[@id="INITIAL_STATE"]/text()', 'nodeValue');
        if(txt != null){
          var rating = txt.split('ratingAvg":')[1];
          rating = rating.split(",")[0];
          addElementToDocument('rating', rating);
        }

        //rating count
        if(txt != null){
          var reviews = txt.split('ratingCount":')[1];
          reviews = reviews.split(",")[0];
          addElementToDocument('reviews', reviews);
        }

        // availability
        if(txt != null){
          var aval = txt.split('availability":')[1];
          aval = aval.split(",")[0];
          aval = aval.slice(1,-1);
          if(aval.includes("in")){
            aval = "In Stock"
          }else{
            aval = "Out of Stock"
          }
          addElementToDocument('aval', aval);
        }

        //uan 
        if(txt != null){
          if(txt.includes("ean")){
            var uan = txt.split('ean":')[1];
            uan = uan.split(",")[0];
            uan = uan.slice(1,-1);
            addElementToDocument('uan', uan);
          }
        }

        //ppu
        var ppp = 0;
        addElementToDocument('ppp', ppp);

        var ship = getXpath('//meta[@name="application-name"]/@content', 'nodeValue');
        if(ship != null){
          ship = "Sold by: "+ ship;
          addElementToDocument('ship', ship);
        }

      });
    await context.extract(productDetails);
  },
};
