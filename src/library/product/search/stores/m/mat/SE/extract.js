const { transform } = require('../../../../shared');
const implementation = async function (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        await stall(1000);
      }
      function stall(ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }

      function addHiddenDiv1(id, content, index) {
        // @ts-ignore
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('li[bindonce="product"]')[index];
        // @ts-ignore
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
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
        var p = getAllXpath('//span[@class="ordinary-pris ng-binding"]/text()', 'nodeValue');
        for(var i=0; i<p.length; i++){
          p[i] = p[i].trim();
          p[i] = p[i].replace("Ord pris ","");
          p[i] = p[i].replace(",",".");
          addHiddenDiv1('price', p[i], i);
      }


        // var p = getAllXpath('//div[@class="description"]/a/text()', 'nodeValue');
        // if(p != null){
        //   var pp = [];
        //   for(var i=0; i<p.length; i++){
        //     if(p[i].length != 13){
        //         pp.push(p[i].trim());
        //       }
        //     }
        // }
        // var q = getAllXpath('//div[@class="brandDetail"]/a/text()', 'nodeValue');
        // if( q != null){
        //   var qq = [];
        //   for(var i=0; i<q.length; i++){ 
        //     q[i] = q[i].trim()
        //     if(q[i].length != 0){
        //         qq.push(q[i].trim());
        //       }
        //     }
        // }
        // var rr = getAllXpath('//div[@class="brandDetail"]/a/span/text()', 'nodeValue');

        // if(pp != null && qq != null && rr != null){
        //   var temp = pp[i] +" " + rr[i]+ " " + qq[i];
        //   addHiddenDiv1('name', temp, i);
        // }
      let description, brand;
      var abc = document.querySelectorAll('div[class="productImagesBox"]');
      // const arr = []
      var qq = [];
      for (let i = 0; i < abc.length; i++) {
        // @ts-ignore
        description = document.querySelectorAll('div[class="description"]')[i].innerText;
        // @ts-ignore
        brand = document.querySelectorAll('div[class="brandDetail"]')[i].innerText;
          var dis = description + ' ' + brand;
          qq.push(dis);
        // addHiddenDiv1('name', dis, i);
      }

      for(var i=0; i<qq.length; i++){
        addHiddenDiv1('name', qq[i], i);
      }

    });
  };
  await applyScroll(context);

  

  return await context.extract(productDetails, { transform });
};
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SE',
    store: 'mat',
    transform: transform,
    domain: 'mat.se',
    zipcode: '',
  },
  implementation,
};
