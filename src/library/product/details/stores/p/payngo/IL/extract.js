const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IL',
    store: 'payngo',
    transform,
    domain: 'payngo.co.il',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      //const getInTheBox = document.querySelector('#MainContent_Properties_productDetails').childNodes;
      let getInTheBox=document.evaluate('//div/p[*[contains(text(),"?? ????? ")]] | //div/p[*[contains(text(),"??????? ??????")]] | //div[*[contains(text(),"?? ?????")]] | //div[*[contains(text(),"????? ?????:")]] | //div/p[*[contains(text(),"אביזרים נלווים")]] | //div/p[*[contains(text(),"מה בערכה")]] | //div/p[*[contains(text(),"הערכה כוללת")]]',document,null,XPathResult.FIRST_ORDERED_NODE_TYPE).singleNodeValue;
      console.log("getInTheBox:",!!getInTheBox);
        if (getInTheBox) {
            let getInTheBoxNodes=getInTheBox.childNodes;
	          const getAllProducts = Array.from(getInTheBoxNodes).filter(elem=>elem.nodeType===3 || elem.nodeType===1)
            let takeTextFlag=false;
            let brCountFlag=0;
            let startTextFlag=false;
            console.log("In for loop length:",getAllProducts.length);
            for (let i = 0; i < getAllProducts.length; i++) {
                console.log("brCountFlag:",brCountFlag);
                
                if(getAllProducts[i].textContent.trim().includes("?? ?????") || getAllProducts[i].textContent.trim().includes("??????? ??????") || getAllProducts[i].textContent.trim().includes("?? ?????") || getAllProducts[i].textContent.trim().includes("????? ?????:") || getAllProducts[i].textContent.trim().includes("אביזרים נלווים") || getAllProducts[i].textContent.trim().includes("מה בערכה") || getAllProducts[i].textContent.trim().includes("הערכה כוללת")) {
                  console.log("Found matche.....................");
                  brCountFlag=0;
                  takeTextFlag=true;
                }else if(takeTextFlag){
                  if(brCountFlag===2){
                    takeTextFlag=false;
                  }
                  else if(getAllProducts[i].textContent!=""){
                    brCountFlag=0;
                    startTextFlag=true;

                    addElementToDocument(`inTheBoxText-${i}`, getAllProducts[i].textContent);
                    if(getAllProducts[i].textContent.trim().includes("????.")){
                      takeTextFlag=false;
                    }
                    console.log("textContent:::",getAllProducts[i].textContent);
                  }else{
                    if(startTextFlag){
                      brCountFlag++;
                    }
                    
                  }
                }
                
            }
        }

    });
    await new Promise(resolve => setTimeout(resolve, 10000));
    await context.extract(productDetails, { transform });
  },
};
