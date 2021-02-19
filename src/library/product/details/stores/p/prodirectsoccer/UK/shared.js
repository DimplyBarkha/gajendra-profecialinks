
/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.variantId && row.sku) {
        row.variantId = [{ text: `${row.sku[0].text}${row.variantId[0].text}` }];
      }

      if (row.description) {
        let descText = row.description[0].text;
        descText = descText.replace('Read More', '');
        descText = descText.replace(/•/g, '||');
        row.description = [{ text: descText }];
        const bulletsInDesc = descText.split('||');
        if (bulletsInDesc.length && row.descriptionBullets[0].text == 0) {
          row.descriptionBullets = [{ text: bulletsInDesc.length - 1 }];
        }
      }

      if (row.alternateImages) {
        row.secondaryImageTotal = [{ text: row.alternateImages.length }];
      }

      // if (row.variantCount) {
      //   if (row.variantCount[0].text > 0) {
      //     row.variantCount = [{ text: row.variantCount[0].text - 1 }];
      //   }
      // }

      if (!row.variantId && row.singleProdRpc) {
        try {
          let dataString = row.singleProdRpc[0].text;
          dataString = JSON.parse(dataString);
          if (dataString.offers && dataString.offers[0] && dataString.offers[0].sku) {
            row.variantId = [{ text: dataString.offers[0].sku }];
          }
        } catch (e) {
          console.log(e);
        }
      }

      // if (!row.availabilityText && row.singleProdAvailability) {
      //   row.availabilityText = row.singleProdAvailability;
      // }
      if (row.availabilityText) {
        row.availabilityText.forEach(item => {
          if(item.text.includes('out-of-stock') ||item.text.includes('out-stock') ) {
            item.text = 'Out of Stock'
          }else{
            item.text = 'In Stock'
          }
         
        });
      }

      if (!row.quantity && row.singleProdSize) {
        // row.quantity = row.singleProdSize;
        // row.variantInformation = row.singleProdSize;
      }

      if (row.nameExtended && row.quantity) {
        row.nameExtended = [{ text: `${row.nameExtended[0].text} - ${row.quantity[0].text}` }];
      }

      // if (row.variantCount && row.variantCount[0].text == 0 && row.singleProdAvailability) {
      //   row.availabilityText = row.singleProdAvailability;
      // }
    }
  }

  // Clean up data
  const clean = text => text.toString()
    .replace(/\r\n|\r|\n/g, ' ')
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&amp;#160/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\s{2,}/g, ' ')
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
