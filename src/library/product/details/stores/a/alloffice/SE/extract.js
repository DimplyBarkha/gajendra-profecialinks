const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SE',
    store: 'alloffice',
    transform,
    domain: 'alloffice.se',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {

      document.getElementsByClassName("")[0].setAttribute("id", "catwalk");
      var button = document.getElementById('catwalk');
      setInterval(function(){
         button.click();
          },1000);

      const data3 = document.querySelector('div[class="add-item"][style="display: none;"]');
      var availDiv = document.createElement('div')
      availDiv.className = 'availability';
      if(data3){
        availDiv.setAttribute('availability',"Out Of Stock");
      }
      else{
       availDiv.setAttribute('availability',"In stock");
       }
      document.body.append(availDiv)
    })
   await context.extract(productDetails);
 },
};