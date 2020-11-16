
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
        // row.specifications = [
        //   {
        //     text: text,
        //   },
        // ];
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
      // if (row.variantUrl) {        
      //   const variantUrls = [];
      //   let dupUrl = "";
      //   let urls = [];
      //   row.variantUrl.forEach(item => {
      //     console.log('item:: ', item.text);
      //    urls =  row.variantUrl.filter(it => item.text === it.text);
      //   if(urls && urls.length === 1 ){
      //     variantUrls.push(item);
      //   }else{
      //     if(dupUrl !== item.text){
      //       dupUrl =  item.text;
      //       variantUrls.push(item);
      //     }
      //   }
      //   });
      //   row.variantUrl = variantUrls;
      // }

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
      if (row.caloriesPerServing) {
        let text = '';
        row.caloriesPerServing.forEach(item => {
          text += item.text.replace(/(.*kJ)(.*)/g, '$1/$2');
        });
        row.caloriesPerServing = [
          {
            text: text,
          },
        ];
      }
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} || `;
        });
        row.description = [
          {
            text: text.slice(0, -4),
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
            text: text.slice(0, -4),
          },
        ];
      }
      if (row.variants) {
        let text = '';
        row.variants.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} | `;
        });
        row.variants = [
          {
            text: text.slice(0, -4),
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
            text: text.slice(0, -4),
          },
        ];
      }
      if (row.allergyAdvice) {
        let text = '';
        row.allergyAdvice.forEach(item => {
          text += item.text.replace(/\n/g, '');
        });
        row.allergyAdvice = [
          {
            text: text,
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