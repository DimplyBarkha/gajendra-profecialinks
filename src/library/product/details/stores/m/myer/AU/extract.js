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
    
    const applyScroll = async function (context) {
      return await context.evaluate(async function () {
        //let allData;
        //return allData = await fetch(`https://api.searchspring.net/api/search/search.json?siteId=14dsyu&resultsFormat=native&page=1&resultsPerPage=150&q=${keywords12}`).then(r => r.json());
        let itemDetailsRs;
        let tmpOBJ=JSON.parse(document.querySelector('script#__NEXT_DATA__').textContent);

        let productSKUId=tmpOBJ.props.initialState.productDetails.product.result.id;
        let inStockOutStockApiUrl=`https://api-online.myer.com.au/v2/product/productsupplemental?products=${productSKUId}&itemDetails=true`;
        return itemDetailsRs=fetch(inStockOutStockApiUrl).then(r => r.json());
      });
    };
    const productVariantState=await applyScroll(context);
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));
    //console.log('testtest=======================',productVariantState);

    try{
      await context.evaluate(function (productVariantState) {
        function addHiddenDiv(className, content,) {
          const newDiv = document.createElement('div');
          newDiv.className = className;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          return newDiv;
        }
        function getStockType(productVariantsItemData,variantID){
          //console.log('productVariantsItemData+++++++++++++++++++++++++++++++++++',productVariantsItemData);
          //console.log('variantID+++++++++++++++++++++++++++++++++++',variantID);
          for(let tmp in productVariantsItem){
            //console.log('tmp:::::::::::::::::',productVariantsItem[tmp]);
            if(productVariantsItem[tmp].id==variantID){
              let tmpstockIndicator= productVariantsItem[tmp].stockIndicator;
              console.log('tmpstockIndicator:::::::::::::::::',tmpstockIndicator);
              return tmpstockIndicator;
            }
          }
        }
        //console.log('productVariantState ===================================',productVariantState);
        let productVariantsItem=productVariantState.productList[0].items;
        //console.log('productVariantsItem ===================================',productVariantsItem);
        
        const outerDiv = addHiddenDiv('variants_outer', '');
        let tmpOBJ=JSON.parse(document.querySelector('script#__NEXT_DATA__').textContent);

        /*let productSKUId=tmpOBJ.props.initialState.productDetails.product.result.id;
        let inStockOutStockApiUrl=`https://api-online.myer.com.au/v2/product/productsupplemental?products=${productSKUId}&itemDetails=true`;
        let itemDetailsRs=fetch(inStockOutStockApiUrl).then(r => r.json());
        new Promise((resolve, reject) => setTimeout(resolve, 1000));
        //let productsupplementalArr=itemDetailsRs.productList[0].item;
        console.log('productsupplementalArr::',itemDetailsRs);
        new Promise((resolve, reject) => setTimeout(resolve, 20000));*/
        

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
            //console.log('variantsData:',variantsData);
          }else{
            variantsData = variantsData + " | "+rootObj1[tmp].id;
            //console.log('variantsData===',variantsData);
          }
        }
        console.log('comming with variantsData');
        console.log('variantsData:',variantsData);
        new Promise((resolve, reject) => setTimeout(resolve, 10000));
        for(let tmp in rootObj){
          const skuId = rootObj[tmp].id;
          const skudiv = addHiddenDiv('sku_id', skuId);
          const tmpStocktype=getStockType(productVariantsItem,skuId);
          //let skuURL = rootObj[tmp].size;
          let sku_price = addHiddenDiv('sku_price', "$ "+parseFloat(rootObj[tmp].price).toFixed(3).toString());
          let skuGTIN = addHiddenDiv('sku_gtin',rootObj[tmp].ean);
          let variantsDataDiv = addHiddenDiv('sku_variants',variantsData);
          let variantsCountDiv = addHiddenDiv('sku_variantsCount',variantsCount);
          let tmpStocktypeDiv = addHiddenDiv('sku_tmpStocktype',tmpStocktype);
          const innerDiv = addHiddenDiv('variants_inner', '');
          innerDiv.appendChild(skudiv);
          innerDiv.appendChild(sku_price);
          innerDiv.appendChild(skuGTIN);
          innerDiv.appendChild(variantsDataDiv);
          innerDiv.appendChild(variantsCountDiv);
          innerDiv.appendChild(tmpStocktypeDiv);
          outerDiv.appendChild(innerDiv);
          document.body.appendChild(outerDiv);
        }        
      },productVariantState)
    }catch(e){

    }
    return await context.extract(productDetails, { transform });
  },
};
