/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const cleanUp = (data, context) => {
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
      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
    data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
      el.text = clean(el.text);
    }))));
    return data;
  };
  for (const { group } of data) {
    var idData = ''; var idData1 = ''; var bText = ''; var nText = ''; var skuText = '';
    for (let row of group) {
      if (row.brandText) {
        row.brandText.forEach(item => {
          bText = item.text;
        })
      }
      // if (row.nameExtended) {
      //   row.nameExtended.forEach(item => {
      //     nText = item.text;
      //   })
      // }
      if (row.sku) {
        //console.log('row.sku is comming');
        row.sku.forEach(item => {
          //console.log('row.sku is comming',item.text);
          var idDataArr = item.text.split('(');
          skuText = idDataArr[0];
          //console.log('idDataArr : ',idDataArr);
        });
        row.sku = [{ "text": skuText }];
        row.variantId = [{ "text": skuText }];
      }
      if (row.manufacturerImages) {
        let info = [];
        row.manufacturerImages.forEach(item => {
          info.push(item.text);
        })
        row.manufacturerImages = [{ "text": info.join(' | ') }];
      }
      if (row.reviewCount) {
        row.reviewCount.forEach(item => {
          let reviewCountData = item.text.split(' ');
          item.text = reviewCountData[0];
        });
      }
      // if(row.description){
      //   let inf=[];
      //   row.description.forEach(item=>{
      //     inf.push(item.text);
      //   })
      //   row.description=[{"text":inf.join(' ')}];
      // }
      if (row.description) {
        console.log("row.description", row.description);
        let text = '';
        row.description.forEach(item => {
          text += ' ' + item.text;
          text = text.replace('', '').trim();
        });
        row.description = [{ text }];
      }

      if (row.aggregateRating) {
        let inf = [];
        row.aggregateRating.forEach(item => {
          inf.push(item.text);
        })
        row.aggregateRating = [{ "text": inf.length + ".0" }];
      }
      // if (bText != '') {
      //   row.nameExtended = [{ "text": bText + " - " + nText }];
      // }
      if (row.promotion) {
        let text = '';
        row.promotion.forEach(item => {
          text += ' ' + item.text;
          text = text.replace('', '').trim();
        });
        row.promotion = [{ text }];
      }

      if (row.availabilityText) {
        console.log("row.availabilityText", row.availabilityText);
        row.availabilityText.forEach(item => {
          if (item.text == 'true') {
            item.text = 'In Stock';
          }
          else {
            item.text = 'Out Of stock';

          }
        });
      }
      if (row.directions) {
        // console.log("row.description",row.description);
        let text = '';
        row.directions.forEach(item => {
          text += item.text;
        });
        row.directions = [{ text }];
      }
      if (row.alternateImages) {
        // console.log("row.description",row.description);
        row.alternateImages.forEach(item => {
          if (item.text.includes("&baseURL")) {
            let split1 = item.text.split("&baseURL");
            item.text = `${split1[0]}`;
            item.text = item.text.replace('124', '1024').trim();
            item.text = item.text.replace('124', '1024').trim();
          }
        });
      }
      if (row.image) {
        // console.log("row.description",row.description);
        row.image.forEach(item => {
          item.text = item.text.replace('width=512', 'width=180').trim();
          item.text = item.text.replace('height=512', 'height=170').trim();
        });
      }
      if (row.ingredientsList) {
        console.log("row.ingredientsList", row.ingredientsList);
        row.ingredientsList.forEach(item => {
          if (item.text.includes("Ingredientes:")) {
            let split1 = item.text.split("Ingredientes:");
            item.text = `${split1[1]}`;
            item.text = item.text.replace('', '').trim();
          }
        });
      }
      if (row.weightNet) {
        console.log("row.weightNet", row.weightNet);
        row.weightNet.forEach(item => {
          if (item.text.includes("Peso Líquido:")) {
            item.text = item.text.replace('Peso Líquido:', '').trim();
          }
        });
      }
      if (row.servingSize) {
        console.log("row.servingSize", row.servingSize);
        row.servingSize.forEach(item => {
          if (item.text.includes("Expressão por")) {
            item.text = item.text.replace('Expressão por', '').trim();
            item.text = item.text.replace(':', '').trim();
          }
        });
      }
    }
  }
  return cleanUp(data);
};
module.exports = { transform };