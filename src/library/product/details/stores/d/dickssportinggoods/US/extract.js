const { cleanUp } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {

const { transform } = parameters;
const { productDetails } = dependencies;
await context.evaluate(async function () {
  
  function addHiddenDiv (id, content) {
    const newDiv = document.createElement('div');
    newDiv.id = id;
    newDiv.textContent = content;
    newDiv.style.display = 'none';
    document.body.appendChild(newDiv);
  }
  var page1 = document.querySelector('pdp-product-image-viewer > div > div.col-12.ng-star-inserted > div > div > button')
  if(page1){
    page1.click()
 
  }  
  
  
  const descButton = document.querySelector('base-height dsg-button dsg-button-tertiary');
  if (descButton) {
    descButton.click();
    await new Promise((resolve, reject) => setTimeout(resolve, 5000));
  }
  const description = [];
if(document.querySelector('div > div.description-text-wrapper > div >section > div > ul > li')){
document.querySelectorAll('div > div.description-text-wrapper > div >section > div > ul > li').forEach(e =>{
  description.push(e.textContent);
});
}
addHiddenDiv('description',description.join(' || '));
function replaceAll(string, search, replace) {
  return string.split(search).join(replace);
  }

function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  }
const dimension = getElementByXpath('//div[@class="description-text-wrapper"]//*[contains(text(),"Dimensions:")] | //div[@class="description-text-wrapper"]//*[contains(text(),"Unfolded:")]');

if(dimension){
  var val = dimension.textContent;
  var specification = val.substring(val.indexOf(":")+1);
  if(specification){
    var cleanspec = replaceAll(specification,'”','');
    var spec = replaceAll(cleanspec,'x','|');
    addHiddenDiv('specification',spec);
  }
}

const head= getElementByXpath('//*[@id="toc-decription-header"]')
const desc= getElementByXpath('//pdp-product-long-description/div/common-accordion/div//div[@class="description-text-wrapper"]')

if(head){
  if(desc){
    const add_desc= head.textContent+" "+desc.textContent
    addHiddenDiv('add_desc',add_desc)
  }
}

const title= getElementByXpath('//div/h1[@class="title"]')



const weight = getElementByXpath('//div[@class="description-text-wrapper"]//*[contains(text(),"Weight:")]');

  if(weight){
  var val1 = weight.textContent;
  var weig  = val1.substring(val1.indexOf(":")+1);

  if(weig){
    addHiddenDiv('weig',weig);
  }
}
const material = getElementByXpath('//div[@class="description-text-wrapper"]//*[contains(text(),"Fabric:")]');

  if(material){
  var val2 = material.textContent;
  var fabric  = val2.substring(val2.indexOf(":")+1);
 
  if(fabric){
    addHiddenDiv('fabric',fabric);
  }
}
const country = getElementByXpath('//div[@class="description-text-wrapper"]//*[contains(text(),"Country of Origin : ")]');

    if(country){
    var val3 = country.textContent;
    var origin  = val3.substring(val3.indexOf(":")+1);
    
    if(origin){
      addHiddenDiv('origin',origin);
    }
  }

 
     var txt=document.querySelectorAll("script[type='application/json']")
      var jsting = JSON.parse(txt[0].innerText.replaceAll('&q;','"'))
      var prodEl = document.createElement('ul');
      prodEl.id = "DropdownList";
      document.body.appendChild(prodEl);
      
      
      var key1 = ""
      for(var key in jsting){
        if(jsting[key].skus){
          key1 = key
          break;
        }

      }

      let arr=[];
      if(jsting[key1].skus.length!=0){
        for(var i=0; i<jsting[key1].skus.length; i++){
          const newLi = document.createElement('li');
          document.querySelector('ul[id="DropdownList"]').appendChild(newLi);
          newLi.id = `item${i}`;
        }


      }
      else{
        const newLi = document.createElement('li');
        document.querySelector('ul[id="DropdownList"]').appendChild(newLi);
        newLi.id = 'item0';

      }
      
        
      const array = [...document.querySelectorAll('ul[id="DropdownList"] li')];
      
      const skulist = jsting[key1].skus
   
      if(skulist){
        for (let i = 0; i < skulist.length; i++) {
         
          array[i].setAttribute('variantId',skulist[i].catentryId)
          array[i].setAttribute('sku',jsting[key1].id)
          if(title){
            if(skulist[i].defAttributes){
              if(skulist[i].defAttributes.length > 1 && skulist[i].defAttributes[1].name.includes("Size")){
                const nameExtend= title.textContent+" "+skulist[i].defAttributes[0].value+" "+skulist[i].defAttributes[1].value
               
                array[i].setAttribute("nameExtend",nameExtend)
  
                const variantInformation= skulist[i].defAttributes[0].value+" "+skulist[i].defAttributes[1].value
                array[i].setAttribute("variantInformation",variantInformation)
              }
              else if(skulist[i].defAttributes.length > 0){
                const nameExtend= title.textContent+" "+skulist[i].defAttributes[0].value
              
                array[i].setAttribute("nameExtend",nameExtend)
  
                const variantInformation= skulist[i].defAttributes[0].value
                array[i].setAttribute("variantInformation",variantInformation)
  
              }
              else{
                const nameExtend= title.textContent
                array[i].setAttribute("nameExtend",nameExtend)
  
              }


            }
            else{
              const nameExtend= title.textContent
              array[i].setAttribute("nameExtend",nameExtend)

            }
            
          }
         
          if(skulist[i].defAttributes){
            for(var color in skulist[i].defAttributes){
              if(skulist[i].defAttributes[color].name){
                if (skulist[i].defAttributes[color].name.includes("Size")){
                  array[i].setAttribute("Size",skulist[i].defAttributes[color].value)
                  continue
                }
                if (skulist[i].defAttributes[color].name.includes("Color")){
                  array[i].setAttribute("color",skulist[i].defAttributes[color].value)
                  continue
                }
              
                   
              }
            }
          }
          if(skulist[i].descAttributes){
            for(var avail in skulist[i].descAttributes){
              if(skulist[i].descAttributes[avail].name){
                if (skulist[i].descAttributes[avail].name.includes("Availability")){
                  array[i].setAttribute("Availability",skulist[i].descAttributes[avail].value)
                  break
                }
              }
            }
          }
          if(skulist[i].id){
            array[i].setAttribute("upc",skulist[i].id)
            array[i].setAttribute("price",skulist[i].price.offerPrice)
            array[i].setAttribute("listprice",skulist[i].price.listPrice)
          
          }
        }
        if(skulist.length==0){
          array[0].setAttribute("upc",jsting[key1].id)
          array[0].setAttribute('sku',jsting[key1].id)
          array[0].setAttribute("variantId",jsting[key1].catentryId)
        
          if(title){
            array[0].setAttribute("nameExtend",title.textContent)
          }
        }
      }
      else{
        array[0].setAttribute("nameExtend",title.textContent)
       

      } 
    
   


      
  }); 
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'dickssportinggoods',
    transform: cleanUp,
    domain: 'dickssportinggoods.com',
    zipcode: '',
  },
  implementation,
};
