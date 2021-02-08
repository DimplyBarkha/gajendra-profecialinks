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
        let cVariantGot=false;
        let tmpData1=JSON.parse(document.querySelector('script#__NEXT_DATA__').textContent);
        if(tmpData1.props.initialState.productDetails.attributes.hasOwnProperty('selectedAttributes')){
          console.log('hasOwnProperty === selectedAttributes');
          console.log('tmpData1111 :',tmpData1.props.initialState.productDetails.attributes.selectedAttributes);
          let selAtt=tmpData1.props.initialState.productDetails.attributes.selectedAttributes;
          if(selAtt.hasOwnProperty('id')){
            console.log(' has id',selAtt.id);
            console.log('tmpData1id :',tmpData1.props.initialState.productDetails.attributes.selectedAttributes.id);
            const newDiv = document.createElement('div');
            newDiv.id = 'customselectedVariantDiv';
            newDiv.textContent = tmpData1.props.initialState.productDetails.attributes.selectedAttributes.id;
            newDiv.style.display = 'none';
            document.body.appendChild(newDiv);
            cVariantGot=true;
          }else{
            console.log(' has no id');
          }
        }
        //try{
          
        /*  
          
        }catch(e){

        }*/
        if(cVariantGot==false){
          console.log('going for normal variant');
          let tmpData=JSON.parse(document.querySelector('script#__NEXT_DATA__').textContent);
          let tmpObj=tmpData.props.initialState.productDetails.attributes.variantsMap;
          console.log('tmpObj:',tmpObj);

          for(let tmp in tmpObj){
            console.log('tmp:',tmp);
            let sizeObj=tmpObj[tmp].id;
            console.log('sizeObj:',sizeObj);
            const newDiv = document.createElement('div');
            newDiv.id = 'customselectedVariantDiv';
            newDiv.textContent = sizeObj;
            newDiv.style.display = 'none';
            document.body.appendChild(newDiv);
            break;
          }
        }        
      })
    }catch(e){

    }
    return await context.extract(productDetails, { transform });
  },
};
