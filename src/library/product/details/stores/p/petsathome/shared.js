
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
      for (const row of group) {
        if (row.variants) {
          let text = '';
          row.variants.forEach(item => {
            text = row.variants.map(elm => elm.text).join(' | ');
          });
          row.variants = [
            {
              text: text,
            },
          ];
        } 
        if (row.vitaminAPerServingUom) {
          let text = '';
          row.vitaminAPerServingUom.forEach(item => {
            if(item.text.includes('-?/')) {
              text = item.text.match(/(\w+)/g)[0];
            }else{
              text = row.vitaminAPerServingUom[0].text;
            }
          });
          row.vitaminAPerServingUom = [
            {
              text: text,
            },
          ];
        } 
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
  
  module.exports = { transform };