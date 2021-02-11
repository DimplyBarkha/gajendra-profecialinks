const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'myer',
    transform,
    domain: 'myer.com.au',
    zipcode: '',
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) 
  
  {
    const { productDetails } = dependencies;
    const { transform } = parameters;
    try {
      await context.waitForSelector('div[class="rec_name"]', { timeout: 10000 });
      await new Promise((resolve, reject) => setTimeout(resolve, 10000));

      console.log('selector of inTheBox exist');
    } catch (e) {
      console.log("selector of inTheBox doesn't exist");
    }
    
    try{
      await context.evaluate(function () {
        function addHiddenDiv(className, content) {
          const newDiv = document.createElement('div');
          newDiv.className = className;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          return newDiv;
        }
        const outerDiv = addHiddenDiv('variants_outer', '');
        let tmpOBJ=JSON.parse(document.querySelector('script#__NEXT_DATA__').textContent);
        let rootObj=tmpOBJ.props.initialState.productDetails.attributes.variantsMap;
        let rootObj1=tmpOBJ.props.initialState.productDetails.attributes.variantsMap;
        //const sku = document.querySelector('p[data-automation="product-part-number"] span');
        let variantsData='';
        let variantsCount=0;
        console.log('variantsData:',variantsData);
        for(let tmp in rootObj1){
          variantsCount++;
          if(variantsData==''){
            variantsData = rootObj1[tmp].id;
            console.log('variantsData:',variantsData);
          }else{
            variantsData = variantsData + " | "+rootObj1[tmp].id;
            console.log('variantsData===',variantsData);
          }
        }
        console.log('comming with variantsData');
        console.log('variantsData:',variantsData);
        new Promise((resolve, reject) => setTimeout(resolve, 10000));
        for(let tmp in rootObj){
          const skuId = rootObj[tmp].id;
          const skudiv = addHiddenDiv('sku_id', skuId);
          //let skuURL = rootObj[tmp].size;
          let sku_price = addHiddenDiv('sku_price', "$ "+parseFloat(rootObj[tmp].price).toFixed(3).toString());
          let skuGTIN = addHiddenDiv('sku_gtin',rootObj[tmp].ean);
          let variantsDataDiv = addHiddenDiv('sku_variants',variantsData);
          let variantsCountDiv = addHiddenDiv('sku_variantsCount',variantsCount);
          const innerDiv = addHiddenDiv('variants_inner', '');
          innerDiv.appendChild(skudiv);
          innerDiv.appendChild(sku_price);
          innerDiv.appendChild(skuGTIN);
          innerDiv.appendChild(variantsDataDiv);
          innerDiv.appendChild(variantsCountDiv);
          outerDiv.appendChild(innerDiv);
          document.body.appendChild(outerDiv);
        }        
      })
    }catch(e){

    }
    return await context.extract(productDetails, { transform });
  },
};
