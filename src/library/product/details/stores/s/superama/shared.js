/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  // Default transform function
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

  for (const { group } of data) {
    for (const row of group) {
      if (row.specifications) {
        let text = '';
        row.specifications.forEach(item => {
          text += item.text.replace(/\s{2,}/g, ' ').replace(/\n/g, ' ').trim();
        });
        row.specifications = [
          {
            text: text,
          },
        ];
      }
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text += item.text.replace(/\s{2,}/g, ' ').replace(/\n/g, ' ').trim();
        });
        row.description = [
          {
            text: text,
          },
        ];
      }
      if (row.image) {
        let img = [];
        row.image.forEach(item => {
          if (item.text.indexOf('https:') === -1) {
            item.text = `https:${item.text}`;
          }
        });
      }
      if (row.price && row.price[0]) {
        row.price[0].text = row.price[0].text.replace(/\./g, ',');
      }
      if (row.listPrice && row.listPrice[0]) {
        row.listPrice[0].text = row.listPrice[0].text.replace(/\./g, ',');
      }
      if (row.gtin && row.gtin[0]) {
        row.gtin[0].text = row.gtin[0].text.replace('UPC ', '');
      }
      if ((!row.manufacturer || !row.manufacturer.length) && row.manufacturer1) {
        row.manufacturer = row.manufacturer1;
      }
      if (row.gtin && row.gtin[1]) {
        row.gtin[1].text = row.gtin[1].text.replace('UPC ', ' ');
      }
      if (row.variantId && row.variantId[0]) {
        row.variantId[0].text = row.variantId[0].text.replace('UPC ', '');
      }

      // if (row.variantId) {
      //   const variantIds = [];
      //   let dup = "";
      //   let urls = [];
      //   row.variantId.forEach(item => {
      //     // console.log('item:: ', item.text);
      //    urls =  row.variantId.filter(it => item.text === it.text);
      //   if(urls && urls.length === 1 ){
      //     variantIds.push(item);
      //   }else{
      //     if(dup !== item.text){
      //       dup =  item.text;
      //       variantIds.push(item);
      //     }
      //   }
      //   });
      //   row.variantId = variantIds;
      // }
      if (row.manufacturerDescription) {
        let text = '';
        row.manufacturerDescription.forEach(item => {
          text += item.text.replace(/\s{2,}/g, ' ').replace(/\n/g, ' ').trim();
        });
        row.manufacturerDescription = [
          {
            text: text,
          },
        ];
      }
      // if (row.caloriesPerServing) {
      //   let text = '';
      //   row.caloriesPerServing.forEach(item => {
      //     text += item.text.replace(/(.*kJ)(.*)/g, '$1/$2');
      //   });
      //   row.caloriesPerServing = [
      //     {
      //       text: text,
      //     },
      //   ];
      // }
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} || `;
        });
        row.description = [
          {
            text: text.slice(0, -3),
          },
        ];
      }
      if (row.specifications) {
        let text = '';
        row.specifications.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} || `;
        });
        row.specifications = [
          {
            text: text.slice(0, -3),
          },
        ];
      }
     
      if (row.directions) {
        let text = '';
        row.directions.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')}  `;
        });
        row.directions = [
          {
            text: text.slice(0, -1),
          },
        ];
      }
      if (row.manufacturer) {
        let text = '';
        row.manufacturer.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')}  `;
        });
        row.manufacturer = [
          {
            text: text.slice(0, -1),
          },
        ];
      }
      if (row.ingredientsList) {
        let text = '';
        row.ingredientsList.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')}  `;
        });
        row.ingredientsList = [
          {
            text: text.slice(0, -1),
          },
        ];
      }
      if (row.warnings) {
        let text = '';
        row.warnings.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')}  `;
        });
        row.warnings = [
          {
            text: text.slice(0, -1),
          },
        ];
      }
      if (row.additionalDescBulletInfo) {
        let text = '';
        row.additionalDescBulletInfo.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} || `;
        });
        row.additionalDescBulletInfo = [
          {
            text: text.slice(0, -3),
          },
        ];
      }
      
      
      // if (row.videos) {
      //   for (const item of row.videos) {
      //     if (item.text.includes('.hls.m3u8')) {
      //       item.text = item.text.replace('.hls.m3u8', '.mp4.480.mp4');
      //     }
      //   }
      // }
    }
  }
  return data;
};

module.exports = { transform };