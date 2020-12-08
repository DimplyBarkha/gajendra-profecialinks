const { transform } = require('../../../../shared');
async function implementation (
  // @ts-ignore
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async() => {
  //   var showProducts = document.querySelector('div.is-legal div.promo-footer a.button');
  //   if(showProducts){
  //     // @ts-ignore
  //     showProducts.click();
  //   }
  //   await new Promise((resolve) => setTimeout(resolve, 2000));
  // function removeClasses() {
  //     var element = document.querySelector('form[name="ageVerificationForm"]');
  //     // element.classList.remove("ng-pristine ng-invalid ng-invalid-required ng-valid-date ng-valid-date-not-in-future ng-valid-pattern ng-valid-maxlength");
  //     element.setAttribute("class", "");
  //   }
  // removeClasses();
  // var inputDay = document.querySelector('input#day');
  //  if(inputDay){
  //   // @ts-ignore
  //   inputDay.value = 4;
  //   // inputDay.setAttribute("class", "form-field-input ng-valid ng-valid-pattern ng-valid-maxlength ng-touched ng-not-empty ng-dirty ng-valid-parse");
  //   inputDay.setAttribute("class", "");
  //   inputDay.addEventListener('mouseover', function() {
  //     console.log('Event triggered');
  //   });
  //   await new Promise((resolve) => setTimeout(resolve, 2000));
  //  }
  //  var inputMonth = document.querySelector('select#month');
  // if(inputMonth){
  //  // @ts-ignore
  //  inputMonth.value = "July";
  //  inputMonth.setAttribute("class",'');
  // //  inputMonth.setAttribute("class",'form-field-dropdown ng-pristine ng-valid ng-not-empty ng-touched');
  //  inputMonth.addEventListener('mouseover', function() {
  //   console.log('Event triggered');
  // });
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  // }
  // var inputYear = document.querySelector('input#year');
  //  if(inputYear){
  //   // @ts-ignore
  //   inputYear.value = 1995;
  //   inputYear.setAttribute("class",'');
  //   // inputYear.setAttribute("class",'form-field-input ng-valid ng-valid-pattern ng-valid-maxlength ng-not-empty ng-dirty ng-valid-parse ng-touched');
  //   inputYear.addEventListener('mouseover', function() {
  //     console.log('Event triggered');
  //   });
  //   await new Promise((resolve) => setTimeout(resolve, 2000));
  //  }
  //  var submitBtn = document.querySelector('p.warning-cta button[class="button button-dark"]');
  //   if(submitBtn){
  //     // @ts-ignore
  //     submitBtn.click();
  //   }
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    // function addChildDiv (id, content, index) {
    //   const newDiv = document.createElement('div');
    //   newDiv.id = id;
    //   newDiv.textContent = content;
    //   newDiv.style.display = 'none';
    //   const originalDiv = document.querySelectorAll("section[id*='product-list'] div[tile='tile'] span[class*='product-brand']")[index];
    //   originalDiv.parentNode.insertBefore(newDiv, originalDiv);
    // }
    // const product = document.querySelectorAll("section[id*='product-list'] div[tile='tile']");
    // product.forEach((item, index) => {
    //   const brand = item.querySelector("span[class*='product-brand']") ? item.querySelector("span[class*='product-brand']").innerText : '';
    //   const name = item.querySelector("span[class*='product-name']") ? item.querySelector("span[class*='product-name']").innerText : '';
    //   if (brand && name) {
    //     addChildDiv('ii_name', brand.trim() + ' ' + name.trim(), index);
    //   } else {
    //     addChildDiv('ii_name', name.trim(), index);
    //   }
    // });
    const searchUrl = window.location.href;
    addHiddenDiv('ii_searchUrl', searchUrl);
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'colesonline',
    transform,
    domain: 'shop.coles.com.au',
    zipcode: '',
  },
  implementation,
};
