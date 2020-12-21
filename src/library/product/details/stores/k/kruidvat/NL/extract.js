
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'kruidvat',
    transform: null,
    domain: 'kruidvat.nl',
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
    let scrollTop = 0;
    while (scrollTop !== 1000) {
      await stall(500);
      scrollTop += 500;
      window.scroll(0, scrollTop);
      if (scrollTop === 1000) {
        await stall(500);
        break;
      }
    }

    function stall(ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
    function dataBind(domElement, obj) {    
      var bind = domElement.getAttribute("bind").split(":");
    }
  // function addHiddenDiv(id, content, index) {
  //   const newDiv = document.createElement('div');
  //   newDiv.id = id;
  //   newDiv.textContent = content;
  //   newDiv.style.display = 'none';
  //   const originalDiv = document.querySelectorAll("div[class='container pagecontent']")[index];
  //   originalDiv.parentNode.insertBefore(newDiv, originalDiv);
  // }
  // var Ean =''
  // const priceDecimal = document.getElementsByClassName('product-information__text product-information__ean')[0].innerHTML;
  // const check = priceDecimal.includes('EAN code:')
  // if (check == true){
  //   Ean = priceDecimal.replace("EAN code:", "");

  // }
  // else{
  //   Ean=''
  // }
  // console.log('----------------------------------Ean')
  // addHiddenDiv('Ean', Ean);
  // const aggregateRating = document.querySelectorAll("e2-rating")
  // for (let k = 0; k < aggregateRating.length; k++) {
  // // @ts-ignore
  // let singleRating = aggregateRating[k].getAttribute("rating");
  // console.log(singleRating,'=singleRating')
  // addHiddenDiv('aggregateRating', singleRating, k);
  // }

  try{
    // @ts-ignore
    document.querySelector('#onetrust-accept-btn-handler').click()
    await new Promise(r => setTimeout(r, 6000));
    console.log('----------------------------------cookies')
    // }
    }
    catch(error)
    {

    }
  
  
});
  return await context.extract(productDetails, { transform });
  // return await context.extract(productDetails, { transform, type: 'MERGE_ROWS' });
}


