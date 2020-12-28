const { transform } = require('../format');
async function implementation (
  // @ts-ignore
  inputs,
  parameters,
  context,
  dependencies,
) {
  
  let { transform } = parameters;
  let { productDetails } = dependencies;
  let sizeOfDiv= await context.evaluate(function () {
    function addHiddenDiv (id, content,availability,itemNo,rpc) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.setAttribute('availability',availability);
      newDiv.setAttribute('itemNo',itemNo);
      newDiv.setAttribute('rpc',rpc);
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    let sku=document.URL.substring(document.URL.lastIndexOf('-'),document.URL.length);
    sku=sku.replace(/(-)(.+)(.html)/g,'$2');
    addHiddenDiv('skuDiv',sku);
    let brandName=document.querySelector('h2.product__brandname').innerText;
    let prodName=document.querySelector('h1.product__name').innerText;
    let serverData=document.querySelector('script#__serverData');
    let serverObj=JSON.parse(serverData.innerText.trim());
    let rpcArray=serverObj.simples;
    for(let i=0;i<rpcArray.length;i++){
      let prodFullName=brandName+' '+prodName;
      prodFullName+=' '+rpcArray[i].size;
      let rpc=rpcArray[i].sku;
      if(rpcArray[i].quantity!== 0) addHiddenDiv('descDiv',prodFullName,'In Stock',i,rpc);
      else addHiddenDiv('descDiv',prodFullName,'Out Of Stock',i,rpc);
          }
          return rpcArray.length;
        });
  if(sizeOfDiv!==0){
  for(let i=0;i<sizeOfDiv;i++){
    await context.evaluate(function (i) {
      function addHiddenDiv (id, content,availability,rpc) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.setAttribute('availability',availability);
        newDiv.setAttribute('retailerProdCode',rpc);
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      let currentDiv=`div[itemNo="${i}"]`;
      let currentDivSelector=document.querySelector(currentDiv);
      let content=currentDivSelector.innerText;
      let availability=currentDivSelector.getAttribute('availability');
      let rpc=currentDivSelector.getAttribute('rpc');
      addHiddenDiv('currentDiv',content,availability,rpc);
    },i);
    await context.extract(productDetails, { transform });
    await context.evaluate(function () {
      document.querySelector('div#currentDiv').remove();
    });
  }
  }
  else {let { transform } = parameters;
  let { productDetails } = dependencies;
  await context.extract(productDetails, { transform });}
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AE',
    store: 'namshi',
    transform,
    domain: 'namshi.com',
    zipcode: "''",
  },
  implementation
};
