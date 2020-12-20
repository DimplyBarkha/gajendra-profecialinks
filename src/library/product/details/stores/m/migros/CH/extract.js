const { transform } = require('../format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'migros',
    domain: 'migros.ch',
    transform

  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await new Promise(resolve => setTimeout(resolve, 10000));
    await context.evaluate(async function () {
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

          var url = window.location.href;
          addHiddenDiv("product_url", url);

          var ee = document.querySelectorAll('dd.ng-star-inserted > app-breadcrumb-product-details > div > ol')
          if(ee && ee[0].childElementCount >0){
            for(var i=0; i< ee[0].childElementCount; i++){
              addHiddenDiv("migros_category", ee[0].children[i].textContent);
            }
          }

        var n = document.querySelector('dd[id*="-nutrients"]');
        addHiddenDiv("migros_nutrition",n.textContent);


        var enTitle = document.querySelectorAll('lsp-product-detail-metadata > dd.ng-star-inserted table.mat-table tr.mat-row:nth-child(1) td')[0];
        var en =document.querySelectorAll('lsp-product-detail-metadata > dd.ng-star-inserted table.mat-table tr.mat-row:nth-child(1) td')[2];
        var joinEnergy = enTitle.textContent.concat(":") + en.textContent;
        addHiddenDiv("migros_energy",joinEnergy);

        var lipidsTitle = document.querySelectorAll('lsp-product-detail-metadata > dd.ng-star-inserted table.mat-table tr.mat-row:nth-child(2) td')[0];
        var lipids = document.querySelectorAll('lsp-product-detail-metadata > dd.ng-star-inserted table.mat-table tr.mat-row:nth-child(2) td')[2];
        var joinlipids = lipidsTitle.textContent.concat(":") + lipids.textContent;
        addHiddenDiv("migros_lipids",joinlipids);

        var ftTitle = document.querySelectorAll('lsp-product-detail-metadata > dd.ng-star-inserted table.mat-table tr.mat-row:nth-child(3) td')[0];
        var ft = document.querySelectorAll('lsp-product-detail-metadata > dd.ng-star-inserted table.mat-table tr.mat-row:nth-child(3) td')[2];
        var joinFat = ftTitle.textContent.concat(":") + ft.textContent;
        addHiddenDiv("migros_fats",joinFat);

        var cbTitle = document.querySelectorAll('lsp-product-detail-metadata > dd.ng-star-inserted table.mat-table tr.mat-row:nth-child(4) td')[0];
        var cb =document.querySelectorAll('lsp-product-detail-metadata > dd.ng-star-inserted table.mat-table tr.mat-row:nth-child(4) td')[2];
        var joinCB = cbTitle.textContent.concat(":") + cb.textContent;
        addHiddenDiv("migros_carbohydrates",joinCB);

        var sgTitle =document.querySelectorAll('lsp-product-detail-metadata > dd.ng-star-inserted table.mat-table tr.mat-row:nth-child(5) td')[0];
        var sg =document.querySelectorAll('lsp-product-detail-metadata > dd.ng-star-inserted table.mat-table tr.mat-row:nth-child(5) td')[2];
        var joinSg = sgTitle.textContent.concat(":") + sg.textContent;
        addHiddenDiv("migros_sugar",joinSg);

        var ptTitle =document.querySelectorAll('lsp-product-detail-metadata > dd.ng-star-inserted table.mat-table tr.mat-row:nth-child(6) td')[0];
        var pt =document.querySelectorAll('lsp-product-detail-metadata > dd.ng-star-inserted table.mat-table tr.mat-row:nth-child(6) td')[2];
        var joinPt = ptTitle.textContent.concat(":") + pt.textContent;
        addHiddenDiv("migros_protein",joinPt);

        var sdTitle =document.querySelectorAll('lsp-product-detail-metadata > dd.ng-star-inserted table.mat-table tr.mat-row:nth-child(7) td')[0];
        var sd =document.querySelectorAll('lsp-product-detail-metadata > dd.ng-star-inserted table.mat-table tr.mat-row:nth-child(7) td')[2];
        var joinSd = sdTitle.textContent.concat(":") + sd.textContent;
        addHiddenDiv("migros_sodium",joinSd);

        var stTitle =document.querySelectorAll('lsp-product-detail-metadata > dd.ng-star-inserted table.mat-table tr.mat-row:nth-child(8) td')[0];
        var st = document.querySelectorAll('lsp-product-detail-metadata > dd.ng-star-inserted table.mat-table tr.mat-row:nth-child(8) td')[2] ;
        var joinSt = stTitle.textContent.concat(":") + st.textContent;
        addHiddenDiv("migros_salt",joinSt);

        var ad = document.querySelector('dd[id*="-benefits"]');
        addHiddenDiv("migros_addescription",ad.textContent);
        }
      });
      observer.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});

    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};

