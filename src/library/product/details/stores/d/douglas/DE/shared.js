/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.availabilityText) {
        const availabilityText = row.availabilityText[0].text.trim() === 'Auf Lager' ? 'In stock' : 'Out of stock';
        row.availabilityText[0].text = availabilityText;
      }

      if (row.gtin) {
        const upcObj = JSON.parse(row.gtin[0].text);
        row.gtin[0].text = upcObj.gtin13;
      }


      if (row.variantId && row.variantId[0]) {
        if (row.variantId[0].text.includes('product_id')) {
          const productInfo = row.variantId[0].text;
          const referenceText = 'window.customExactagConfig =';
          const productData = JSON.parse(productInfo.substring((productInfo.indexOf(referenceText) + referenceText.length), productInfo.indexOf('}') + 1));
          row.variantId[0].text = productData.product_id;
        } else if (row.variantId[0].text.includes('Art-Nr.')){
          row.variantId[0].text = row.variantId[0].text.replace('Art-Nr. ', '');
        }
      }

      if (row.aggregateRating) {
        const aggregateRating2 = row.aggregateRating[0].text;
        const ratingValue = JSON.parse(aggregateRating2);
        if (ratingValue && ratingValue.aggregateRating && ratingValue.aggregateRating.ratingValue !== null) {
          row.aggregateRating[0].text = ratingValue.aggregateRating.ratingValue.toFixed(1).toString().replace('.', ',');
        } else {
          delete row.aggregateRating;
        }
      }

      if (row.aggregateRating2) {
        const aggregateRating2 = row.aggregateRating2[0].text;
        const ratingValue = JSON.parse(aggregateRating2);
        if (ratingValue && ratingValue.aggregateRating && ratingValue.aggregateRating.ratingValue !== null) {
          row.aggregateRating2[0].text = ratingValue.aggregateRating.ratingValue.toFixed(1).toString().replace('.', ',');
        } else {
          delete row.aggregateRating2;
        }
      }

      if (row.manufacturerDescription) {
        var finalDescription = '';
        for (const description of row.manufacturerDescription) {
          finalDescription += ' ' + description.text;
        }
        row.manufacturerDescription = [{ text: finalDescription.trim() }];
      }

      if (row.color) {
        const color = row.color[0].text;
        row.color[0].text = color.substring(color.lastIndexOf(':') + 1).trim();
      }

      if (row.descriptionChunck) {
        let text = '';
        row.descriptionChunck.forEach(item => {
          text += `${item.text} `;
        });
        row.descriptionChunck = [
          {
            text: text.trim(),
          },
        ];
      }

      try {
        if (row.descriptionLiHeaders && row.descriptionLiData) {
          const descriptonHeaders = row.descriptionLiHeaders;
          let concatedDescription = descriptonHeaders.map((header, index) => {
            return {text: `${header.text} : ${row.descriptionLiData[index].text}`};
          });
          row.description = concatedDescription;
        }
      } catch (err) {
        console.log(err);
      }
     
      
      if (row.description) {
        // row.description[0].text = `|| ${row.description[0].text}`;
        // for (let i = 0; i < row.description.length; i++) {
        //   row.description[i].text = `|| ${row.description[i].text}`;
        // }

        if (row.descriptionChunck) {
          row.description[row.description.length - 1].text = `${row.description[row.description.length - 1].text} ${row.descriptionChunck[0].text}`;
        }

        if (row.descriptionliChunck) {
          let liChunk = row.descriptionliChunck;
          // for (let i = 0; i < liChunk.length; i++) {
          //   liChunk[i].text = `|| ${liChunk[i].text}`;
          // }
          row.description = row.description.concat(liChunk);
        }
      }

      if (row.additionalDescBulletInfo) {
        row.additionalDescBulletInfo[0].text = `|| ${row.additionalDescBulletInfo[0].text}`;
      }

      // if (row.unInterruptedPDP) {
      //   for (let i = 0; i < row.unInterruptedPDP.length; i++) {
      //     row.unInterruptedPDP[i].text = `|| ${row.unInterruptedPDP[i].text}`;
      //   }
      // }

      if (row.variantInformation) {
        if (row.color) {
          row.variantInformation = [{ text: row.color[0].text }];
          if (row.color[0].text === 'ProductName' && row.quantity) {
            row.variantInformation = [{ text: row.quantity[0].text }];
          }
        }
      }

      if (row.nameExtended) {
        let nameExtended = row.nameExtended[0].text;
        if (row.nameExtendedPrefix) {
          const prefix = row.nameExtendedPrefix[0].text;
          if (!nameExtended.toLowerCase().includes(prefix.toLowerCase())) {
            nameExtended = `${prefix} ${nameExtended}`;
          } 
        }
        

        if (row.variantInformation) {
          nameExtended += ` ${row.variantInformation[0].text}`;
        } else if (row.quantity) {
          nameExtended += ` ${row.quantity[0].text}`;
        };
        row.nameExtended = [{ text: nameExtended }];
      }

      if (row.pricePerUnit) {
        const pricePerUnit = row.pricePerUnit[0].text;
        row.pricePerUnit[0].text = pricePerUnit.split('\/')[0];
        row.pricePerUnitUom = [{ text: pricePerUnit.split('\/')[1]}];
      }

      // if(row.ingredientsList) {
      //   try {
      //     let product = row.ingredientsList[0].text;
      //     product = product.replace('window.__INITIAL_STATE__ =' , '');
      //     console.log(product);
      //     product = product.substring(0, product.indexOf('; window.__INITIAL_CONFIG__'));
      //     // console.log((JSON.parse(product)));
      //     console.log((product));
      //     let a = JSON.parse(product);
      //     console.log(a)
      //     // console.log(JSON.parse(product))
      //     row.ingredientsList = [{text: product} ];

          

          
        

      //     // let productData = JSON.parse(row.ingredientsList[0].text);
      //     // if (productData.window.__INITIAL_STATE__ && 
      //     //   productData.window.__INITIAL_STATE__.product && 
      //     //   productData.window.__INITIAL_STATE__.product.data && 
      //     //   productData.window.__INITIAL_STATE__.product.data.ingredients) {
      //     //     row.ingredientsList = [{ text:productData.window.__INITIAL_STATE__.product.data.ingredients }];
      //     //   }
      //   } catch (err) {
      //     console.log(err);
      //   }
      // }

      // if (row.ingredientsList) {
      //   const ingredientsList =  row.ingredientsList;
      //   let ingredients = '';
      //   for (let i = 0; i < ingredientsList.length; i++) {
      //     ingredients += `${ingredientsList[i].text }`;
      //   }
      //   row.ingredientsList[0].text = ingredients;
      // }

      row.imageZoomFeaturePresent = [{ text: 'Yes' }];
    }
  }

  // Clean up data
  const clean = text => text.toString()
    .replace(/\r\n|\r|\n/g, ' ')
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&amp;#160/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/"\s{1,}/g, '"')
    .replace(/\s{1,}"/g, '"')
    .replace(/^ +| +$|( )+/g, ' ')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ')
    .trim();

  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));

  return data;
};

module.exports = { transform };
