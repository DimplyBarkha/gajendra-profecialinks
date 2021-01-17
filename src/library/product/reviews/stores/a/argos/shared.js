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
  
    for (const { group }
      of data) {
      for (const row of group) {
        if (row.brand) {
          row.brand.forEach(item => {
              if(item.text.includes("Vype") || item.text.includes("vype") || item.text.includes("VYPE")){
                item.text = 'Vype';
              }else if(item.text.includes("Juul") || item.text.includes("juul") || item.text.includes("JUUL")){
                item.text = 'Juul';
              }else if(item.text.includes("Blu") || item.text.includes("blu") || item.text.includes("BLU")){
                item.text = 'Blu';
              }else if(item.text.includes("Vuse") || item.text.includes("vuse") || item.text.includes("VISE")){
                item.text = 'Vuse';
              }else{
                item.text = item.text;
              }
          });
        }
      }
    }
    return data;
  };
  
  module.exports = { transform };
  