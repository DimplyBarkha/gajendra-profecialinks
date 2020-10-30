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
    for (let row of group) {
      if (row.category) {
        if(row.category.length){
          row.category.splice(0,1);
        }
      }
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          item.text = item.text.replace(/\/image\/.+?\//,'/image/');
        });
      }
      if (row.pricePerUnit) {
        row.pricePerUnit.forEach(item => {
          var d_arr = item.text.split("/");
          item.text = d_arr[0];
          row.pricePerUnitUom = [{"text": d_arr[1]}];
        });
      }        
      if (row.description) {
        var descArr = [];
        row.description.forEach(item => {
          item.text = descArr.push(item.text);
        });
        if(descArr.length){
          row.description = [{"text": descArr.join(' | ')}];
        }
      }
      if (row.countryOfOrigin) {
        row.countryOfOrigin.forEach(item => {
          item.text = item.text.replace(/Place\s+of\s+origin\s*:/,'');
        });
      }            
    }
  }
  return cleanUp(data);
};

module.exports = { transform };