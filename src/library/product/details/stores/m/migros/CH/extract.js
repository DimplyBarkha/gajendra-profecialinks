const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'migros',
    domain: 'migros.ch',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, dependencies) => {
    await new Promise(resolve => setTimeout(resolve, 10000));
    await context.evaluate(function () {
      function addHiddenDiv (elementID, content) {
        const newDiv = document.createElement('div');
        newDiv.className = elementID;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
     
      var observer = new MutationObserver(function(mutations) {
        if (document.querySelector('.hgroup')) {
          var el = document.getElementsByClassName('hgroup');
          addHiddenDiv("migros_name", el[0].firstElementChild.innerText);
          
          observer.disconnect();

         // observer.disconnect();
          addHiddenDiv("migros_description", el[0].children[1].innerText);

          var ee = document.querySelectorAll('dd.ng-star-inserted > app-breadcrumb-product-details > div > ol')
          if(ee && ee[0].childElementCount >0){
            for(var i=0; i< ee[0].childElementCount; i++){
              addHiddenDiv("migros_category", ee[0].children[i].textContent);
            }
          }  
        
         var ig= document.querySelectorAll('lsp-product-detail-metadata > dd.ng-star-inserted')[0];
         addHiddenDiv("migros_ingredients",ig.textContent);
       
        var al= document.querySelectorAll('lsp-product-detail-metadata > dd.ng-star-inserted')[1];
        addHiddenDiv("migros_allergy",al.textContent);

        var n = document.querySelector('dd[id*="-nutrients"]');
        addHiddenDiv("migros_nutrition",n.textContent);
     /*  var en =document.querySelectorAll('lsp-product-detail-metadata > dd.ng-star-inserted table.mat-table tr.mat-row:nth-child(1) td')[1]; 
        addHiddenDiv("migros_energy",en.textContent);

        var ft =document.querySelectorAll('lsp-product-detail-metadata > dd.ng-star-inserted table.mat-table tr.mat-row:nth-child(3) td')[1]; 
        addHiddenDiv("migros_fats",ft.textContent);

        var cb =document.querySelectorAll('lsp-product-detail-metadata > dd.ng-star-inserted table.mat-table tr.mat-row:nth-child(4) td')[1]; 
        addHiddenDiv("migros_carbohydrates",cb.textContent);

        var sg =document.querySelectorAll('lsp-product-detail-metadata > dd.ng-star-inserted table.mat-table tr.mat-row:nth-child(5) td')[1]; 
        addHiddenDiv("migros_sugar",sg.textContent);

        var pt =document.querySelectorAll('lsp-product-detail-metadata > dd.ng-star-inserted table.mat-table tr.mat-row:nth-child(6) td')[1]; 
        addHiddenDiv("migros_protein",pt.textContent);

        var sd =document.querySelectorAll('lsp-product-detail-metadata > dd.ng-star-inserted table.mat-table tr.mat-row:nth-child(7) td')[1]; 
        addHiddenDiv("migros_sodium",sd.textContent);

        var st =document.querySelectorAll('lsp-product-detail-metadata > dd.ng-star-inserted table.mat-table tr.mat-row:nth-child(8) td')[1]; 
        addHiddenDiv("migros_salt",st.textContent);*/

        var store =document.querySelectorAll('lsp-product-detail-metadata > dd.ng-star-inserted:nth-child(8)')[0];
        addHiddenDiv("migros_storage",store.textContent);

        var country= document.querySelectorAll('lsp-product-detail-metadata > dd.ng-star-inserted')[5];
        addHiddenDiv("migros_origin",country.textContent)

        var price= document.querySelectorAll('lsp-product-price > span.price.ng-star-inserted')[23];
        addHiddenDiv("migros_price",price.textContent)


        var weight = document.querySelectorAll('lsp-product-price-quantity')[23];
        addHiddenDiv("migros_weight",weight.textContent);

        var ss = document.querySelectorAll("dd.pid");
        addHiddenDiv("migros_sku",ss[0].innerText);

       /* var image =document.querySelectorAll('aside.product-detail-image > div.square > div')[0];
        addHiddenDiv("migros_image",image);*/
        var elementImage  = document.querySelectorAll('aside.product-detail-image > div > div');
        addHiddenDiv("migros_image", elementImage[0].style.backgroundImage.slice(4, -1).replace(/"/g, ""));

        var ad = document.querySelector('dd[id*="-benefits"]');
        addHiddenDiv("migros_addescription",ad.textContent);
        
        } 
      });
      observer.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});
    });
    await context.extract(dependencies.productDetails);
  },
};
