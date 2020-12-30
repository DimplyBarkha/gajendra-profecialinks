const {transform} = require('./format')
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;


  await context.evaluate(async (j) => {
    function addHiddenDiv(id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.innerHTML = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
      var descriptionData = "";
      var descriptionUl = "";
      var childNodes = (document.querySelector(".product-desc-box__description .static-page__area") ? document.querySelector(".product-desc-box__description .static-page__area").childNodes : []);
      childNodes.forEach(x => {
        
        if(descriptionData == undefined){
          descriptionData = "";
        }
        if(x.localName == "ul"){
          descriptionUl = "";
          x.childNodes.forEach(y => {
            if( y.innerHTML != undefined){
              if((y.innerHTML).trim() != ""){
            if(descriptionUl == "")
            descriptionUl = y.innerText;
            else
            descriptionUl += " || " + y.innerText;
            }
            }
          })
          descriptionData += " " + descriptionUl;
        }
        else{
          descriptionData += x.innerText;
        }
        
        descriptionData = descriptionData.replace("undefined","");
      })
      if(descriptionData == ""){
        descriptionData = document.querySelector(".product-desc-box__description .static-page__area") ? document.querySelector(".product-desc-box__description .static-page__area").innerHTML : "";
      }
      console.log(descriptionUl);
      addHiddenDiv("page_description" , descriptionData);
      addHiddenDiv("page_Adddescription" , descriptionUl);
      var products = window.edTrackerConf.product;
      console.log(products);
      if(products){
        addHiddenDiv("page_brand" , products.brand);
      }
    }); 
      return await context.extract(productDetails, { transform });
    }
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'HU',
    store: 'edigital',
    transform,
    domain: 'edigital.hu',
    zipcode: '',
  },
  implementation
};
