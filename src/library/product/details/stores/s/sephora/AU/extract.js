const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'sephora',
    transform,
    domain: 'sephora.com.au',
    zipcode: '',
  },
  implementation: async ({ parentInput }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await new Promise(resolve => setTimeout(resolve, 5000));
    await context.evaluate(function() {
      document.cookie = "locale=au;";
    })

    const nameExtended = await context.evaluate(function(parentInput) {

      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      addHiddenDiv(`ii_parentInput`, parentInput);
      let name = [];
      let variant = '//span[contains(@class, "current-variant-name")]';
      let variant2 = '//ul[contains(@class, "product-variant-swatches")]//li[contains(@class,"product-variant-swatch active")]//@title'
      let names = '//div[@class="basic-information-section"]//div[contains(@class, "product-")]';
      let names2 = '//h1[contains(@class, "product-name")]'
      let brand2 = '//h2[contains(@class, "product-brand")]'
      let directions = '//div[@class="product-details"]/div[contains(.,"How To")]//text()'
      let directions2 = '//div[contains(@class, "product-description")]//div[contains(@id,"product-how-to")]//text()'
      let directionBullets = '//div[contains(@class, "how-to")]//li'
      let directionBullets2 = '//div[contains(@class, "product-description")]//div[contains(@id,"product-how-to")]//li'
      let description = '//div[@class="product-details"]/div[contains(.,"Description")]//text()'
      let description2 = '//div[contains(@class, "product-description")]//div[contains(@id,"product-description")]//text()'
      let descriptionBullets = '//div[contains(@class, "product-description")]//li'
      let descriptionBullets2 = '//div[contains(@class, "product-description")]//div[contains(@id,"product-description")]//li'
      var directionsBCheck = document.evaluate( directionBullets, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      var descriptionBCheck = document.evaluate( descriptionBullets, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      var directionsCheck = document.evaluate( directions, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      var descriptionCheck = document.evaluate( description, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      var variantCheck = document.evaluate( variant, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      var namesCheck = document.evaluate( names, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      var directionsBCheck2 = document.evaluate( directionBullets2, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      var descriptionBCheck2 = document.evaluate( descriptionBullets2, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      var directionsCheck2 = document.evaluate( directions2, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      var descriptionCheck2 = document.evaluate( description2, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      var variantCheck2 = document.evaluate( variant2, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      var namesCheck2 = document.evaluate( names2, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      var brandCheck2 = document.evaluate( brand2, document, null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);


      if(namesCheck.snapshotLength > 0 || namesCheck2.snapshotLength > 0){
        let checkName1 = namesCheck.snapshotItem(0)||brandCheck2.snapshotItem(0)
        let checkName2 = namesCheck.snapshotItem(1)||namesCheck2.snapshotItem(0)
        let checkVariant = variantCheck.snapshotItem(0)||variantCheck2.snapshotItem(0)
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
        addHiddenDiv('ii_nameExtended', fullName);
      }

      if(directionsCheck.snapshotLength > 0 || directionsCheck2.snapshotLength > 0){
        let fullDir = [];
        let snapshotLength = directionsCheck.snapshotLength || directionsCheck2.snapshotLength
        for(let i = 0; i < snapshotLength; i++) {
          let line = directionsCheck.snapshotItem(i) || directionsCheck2.snapshotItem(i)
          console.log("HERE123" + line)
          if(directionsBCheck.snapshotLength > 0 || directionsBCheck2.snapshotLength > 0){
            let snapLength = directionsBCheck.snapshotLength || directionsBCheck2.snapshotLength
            for(let i = 0; i < snapLength; i++) {
              let content = directionsBCheck.snapshotItem(i) || directionsBCheck2.snapshotItem(i)
              if(line.textContent.includes(content.textContent)){
                line.textContent = ` || ${line.textContent}`;
              }
            }
          }
          fullDir.push(line.textContent)
        }
        let joins = fullDir.join(" ");
        addHiddenDiv('ii_directions', joins);
      }

      if(descriptionCheck.snapshotLength > 0){
        let fullDesc = [];
        for(let i = 1; i < descriptionCheck.snapshotLength; i++) {
          let line = descriptionCheck.snapshotItem(i).textContent;
          if(descriptionBCheck.snapshotLength > 0){
            for(let i = 0; i < descriptionBCheck.snapshotLength; i++) {
              if(line.includes(descriptionBCheck.snapshotItem(i).textContent)){
                line = ` || ${line}`;
              }
            }
          }
          fullDesc.push(line)
        }
        let joins = fullDesc.join(" ");
        addHiddenDiv('ii_description', joins);
      }



    }, parentInput)
    
    // await new Promise(resolve => setTimeout(resolve, 10000));
    return await context.extract(productDetails, { transform: transformParam });
  },
};
