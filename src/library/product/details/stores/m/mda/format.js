
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
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
        let count = 0;
        row.specifications.forEach(item => {
          if (count % 2 === 0) {
            text += `${item.text.replace(/\n \n/g, '')} : `;
          } else {
            text += `${item.text.replace(/\n \n/g, '')} || `;
          }
          count++;
        });
        row.specifications = [
          {
            text: text.slice(0, -4),
          },
        ];
      }
      if (row.price) {
        row.price = [
          {
            text: `€ ${row.price[0].text.replace('.', ',')}`,
          },
        ];
      }
      if (row.listPrice) {
        row.listPrice = [
          {
            text: `€ ${row.listPrice[0].text.replace('.', ',')}`,
          },
        ];
      }
      if (row.name && row.brandText) {
        row.nameExtended = [
          { text: row.brandText[0].text + ' - ' + row.name[0].text },
        ];
      }
      if (row.description) {
        let desc = '';
        row.description.forEach(item => {
          desc += ` || ${item.text.trim()}`;
        });
        row.description = [
          {
            text: desc.slice(1),
          },
        ];
      }
      if (row.additionalDescBulletInfo) {
        let desc = '';
        row.additionalDescBulletInfo.forEach(item => {
          desc += `${item.text} || `;
        });
        row.additionalDescBulletInfo = [
          {
            text: desc.slice(0, -4),
          },
        ];
      }
      if (row.inTheBoxText) {
        let inTheBoxText = '';
        row.inTheBoxText.forEach((item,i) => {
    
          if(i!=row.inTheBoxText.length-1){
             inTheBoxText += item.text + ","
          }else{
            inTheBoxText += item.text
          }
        
        });
        row.inTheBoxText = [
          {
            text: inTheBoxText.replace(/,/g, " || ")
          },
        ];
      }
    }
  }

  return data;
};

module.exports = { transform };
