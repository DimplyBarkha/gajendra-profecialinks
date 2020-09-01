const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NZ',
    store: 'sephora',
    transform,
    domain: 'sephora.nz',
    zipcode: '',
  },
  implementation: async ({ parentInput }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await new Promise(resolve => setTimeout(resolve, 5000));
    await context.evaluate(function() {
      document.cookie = "locale=au;";
    })

    // const html = await context.evaluate(async function getEnhancedContent() {
    //   let srcArray = [];
    //   async function fetchRetry(url, n) {
    //     function handleErrors(response) {
    //       if (response.status === 200){
    //         return response;
    //       } else {
    //         console.log("FETCH FAILED")
    //         if (n === 1) return "Nothing Found";
    //         return fetchRetry(url, n - 1);
    //       }
    //     }
    //     let fetched = fetch(url)
    //     .then(handleErrors).then(response => response.text()).catch(error => {
    //         console.log("FETCH FAILED")
    //         if (n === 1) return "Nothing Found";
    //         return fetchRetry(url, n - 1);
    //     });
    //     return fetched;
    //   }
    //     let fetchTry = await fetchRetry(`https://www.sephora.nz/products/benefit-cosmetics-roller-liner-black-liquid-eyeliner/v/black-mini`, 5);
    //     if(fetchTry !== "Nothing Found"){
    //       srcArray.push(fetchTry);
    //     }
    //   return srcArray;
    // });

    const nameExtended = await context.evaluate(function(parentInput, html) {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      addHiddenDiv(`ii_parentInput`, parentInput);


      let name = [];
      let variant = '//*[contains(@class, "product-variant-swatch active")]';
      let brandName = '//div[contains(@class, "product-info")]//*[contains(@class, "product-brand")]';
      let prodName = '//div[contains(@class, "product-info")]//*[contains(@class, "product-name")]';
      let directions = '//div[contains(@id, "product-how-to")]';
      let directionBullets = '//div[contains(@id, "product-how-to")]//li';
      let description = '//div[contains(@id, "product-description")]';
      let descriptionBullets = '//div[contains(@id, "product-description")]//li';
      let ingredients = '//div[contains(@id, "product-ingredients")]';
      let ingredientsBullets = '//div[contains(@id, "product-ingredients")]//li';
      var variantCheck = document.evaluate( variant, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      var brandNameCheck = document.evaluate( brandName, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      var prodNameCheck = document.evaluate( prodName, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      var directionsBCheck = document.evaluate( directionBullets, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      var descriptionBCheck = document.evaluate( descriptionBullets, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      var directionsCheck = document.evaluate( directions, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      var descriptionCheck = document.evaluate( description, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      var ingredientsCheck = document.evaluate( ingredients, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      var ingredientsBCheck = document.evaluate( ingredientsBullets, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      
      if(brandNameCheck.snapshotLength > 0){
        let checkName1 = brandNameCheck.snapshotItem(0);
        let checkName2 = prodNameCheck.snapshotItem(0);
        let checkVariant = variantCheck.snapshotItem(0);
        if(checkName1){
          name.push(checkName1.textContent);
        }
        if(checkName2){
          name.push(checkName2.textContent);
        }
        if(checkVariant){
          name.push(checkVariant.textContent);
        }

        let fullName = name.join(" - ")
        console.log("HELLO123" + fullName)

        addHiddenDiv('ii_nameExtended', fullName);
      }
      
      if(directionsCheck.snapshotLength > 0){
        let fullDir = [];
        for(let i = 0; i < directionsCheck.snapshotLength; i++) {
          let line = directionsCheck.snapshotItem(i).textContent;
          if(directionsBCheck.snapshotLength > 0){
            for(let i = 0; i < directionsBCheck.snapshotLength; i++) {
              let bullet = directionsBCheck.snapshotItem(i).textContent
              if(line.includes(bullet)){
                let splits = line.split(`${bullet}`);
                line = splits.join(` || ${bullet}`)
              }
            }
          }
          fullDir.push(line)
        }
        let joins = fullDir.join(" ");
        addHiddenDiv('ii_directions', joins);
      }

      if(descriptionCheck.snapshotLength > 0){
        let fullDesc = [];
        for(let i = 0; i < descriptionCheck.snapshotLength; i++) {
          let line = descriptionCheck.snapshotItem(i).textContent;
          if(descriptionBCheck.snapshotLength > 0){
            for(let i = 0; i < descriptionBCheck.snapshotLength; i++) {
              let bullet = descriptionBCheck.snapshotItem(i).textContent
              if(line.includes(bullet)){
                let splits = line.split(`${bullet}`);
                line = splits.join(` || ${bullet}`)
              }
            }
          }
          fullDesc.push(line)
        }
        let joins = fullDesc.join(" ");
        addHiddenDiv('ii_description', joins);
      }

      if(ingredientsCheck.snapshotLength > 0){
        let fullDesc = [];
        for(let i = 0; i < ingredientsCheck.snapshotLength; i++) {
          let line = ingredientsCheck.snapshotItem(i).textContent;
          if(ingredientsBCheck.snapshotLength > 0){
            for(let i = 0; i < ingredientsBCheck.snapshotLength; i++) {
              let bullet = ingredientsBCheck.snapshotItem(i).textContent
              if(line.includes(bullet)){
                let splits = line.split(`${bullet}`);
                line = splits.join(` || ${bullet}`)
              }
            }
          }
          fullDesc.push(line)
        }
        let joins = fullDesc.join(" ");
        addHiddenDiv('ii_ingredients', joins);
      }
    }, parentInput);
    
    return await context.extract(productDetails, { transform: transformParam });
  },
};
