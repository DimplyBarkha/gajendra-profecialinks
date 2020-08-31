
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
      for (const row of group) {
        if (row.additionalDescBulletInfo) {
          row.descriptionBullets = [{
            text: row.additionalDescBulletInfo.length,
          },
          ];
        }
        if (row.image && !row.image[0].text.startsWith('http')) {
          row.image[0].text = `https://www.elgiganten.se/${row.image[0].text}`;
        }
        if (row.alternateImages) {
          row.alternateImages.forEach(image => {
            if (!image.text.startsWith('http')) {
              image.text = `https://www.elgiganten.se/${image.text}`;
            }
          });
        }
        if (row.description) {
          let text='';
          if(row.description[0].text.includes('Key Benefits')){
          text = row.description[0].text.split('Key Benefits')
          text = text[0].replace(/(\s*\n\s*)+/g, ' ') + 'Key Benefits' + text[1].replace(/(\s*\n\s*)+/g, ' || ')
          }else{
          text = row.description[0].text.replace(/(\s*\n\s*)+/g, ' ');
          }
          row.description = [{
          text:text
          }]
          }
        if (row.manufacturerImages) {
          row.manufacturerImages.forEach(image => {
            if (!image.text.startsWith('http')) {
              image.text = `https://www.elgiganten.se/${image.text}`;
            }
          });
        }
        
        if (row.specifications) {
          row.specifications = [{
            text: row.specifications.reduce((item, currentItem) => `${item} || ${currentItem.text.replace(/(\n\s\n)+/g, ': ')}`, '').slice(4).trim(),
          },
          ];
        }
  
        if (row.price) {
          row.price[0].text = row.price[0].text.replace(/(\s)+/g, '');
        }

        // if (row.manufacturerDescription) {
        //   row.manufacturerDescription[0].text = row.manufacturerDescription[0].text.replace(/\s*\n\s*/g, '||');
        // }
        
        if (row.metaKeywords) {
          row.metaKeywords[0].text = row.metaKeywords[0].text.replace(/\s*\t\s*/g, ' ');
        }

      }
  
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
  }
  module.exports = { transform };
  