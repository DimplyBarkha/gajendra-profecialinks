const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CH',
    store: 'microspot_ch_de',
    transform: transform,
    domain: 'microspot.ch',
    zipcode: '',
  },
  implementation,
};
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    function addclass(xpathforpagination) {
      var elems = document.querySelectorAll(xpathforpagination);
      elems[0].classList.add('pagination');
    }

    function addHiddenDiv(id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll('div[class="_3Xsu6q"]')[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    }
    function addHiddenDiv1(id, content, index) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll('div[class="wQ1zdx _14LFJJ _1ryioq"]')[index];
      originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    }
    
    // Method to Retrieve Xpath content of a Multiple Nodes
    const getAllXpath = (xpath, prop) => {
      const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      const result = [];
      for (let index = 0; index < nodeSet.snapshotLength; index++) {
        const element = nodeSet.snapshotItem(index);
        if (element) result.push(prop ? element[prop] : element.nodeValue);
      }
      return result;
    };

    var agg = getAllXpath('(//div[@class="_3Xsu6q"])/@class', 'nodeValue');
    var d = getAllXpath('(//div[@class="_3Xsu6q"]/child::*/child::*)/@d', 'nodeValue');
    var j = 0;
    if(agg != null){
      for(var i=0; i<agg.length;i++){
        var rat = 0;
        for(var one=0; one<5;one++){
          if(d[j] == "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"){
            rat = rat+1;
          }
          if(d[j] == "M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"){
            rat = rat+0;
          }
          if(d[j] == "M22 9.2l-7.2-.6L12 2 9.2 8.6 2 9.2 7.5 14l-1.6 7 6.2-3.7 6.2 3.7-1.6-7L22 9.2zm-10 6.2V6.1l1.7 4 4.4.4-3.3 2.9 1 4.3-3.8-2.3z"){
            rat = rat + 0.5;
          }
          j = j+1;
        }
        addHiddenDiv('rat', rat, i);
      }
    }

    //manufacture
    var manu = getAllXpath('//script[@id="INITIAL_STATE"]/text()', 'nodeValue');
    if(manu != null){
      for(var i=0; i<manu.length; i++){
        var abc = manu[i].split('manufacturer":"')[1];
        var manufacture = abc.split('",')[0];
        addHiddenDiv1('manufacture', manufacture, i);
      }
    }
    



  });
return await context.extract(productDetails, { transform });
}