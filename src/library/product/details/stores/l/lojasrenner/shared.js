
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
        if (row.image) {
          row.image.forEach(item => {
            if(item.text.includes('https:')){
                item.text = item.text;
            }else{
                item.text = "https:"+item.text;
            }
          });
        }
        if (row.alternateImages) {
          row.alternateImages.shift();
          row.alternateImages.forEach(item => {
            if(item.text.includes('https:')){
                item.text = item.text;
            }else{
                item.text = "https:"+item.text;
            }
          });
        }
        if (row.nameExtended) {
            row.nameExtended.forEach(item => {
              if(item.text.includes('Marca:')){
                  item.text = item.text.replace(/Marca:(.*)/,'$1').trim();
              }else{
                  item.text = item.text.trim();
              }
            });
          }
          if (row.firstVariant) {
            row.firstVariant.forEach(item => {
                  item.text = item.text.replace(/Ref\:(.*)/g,'$1').trim();
            });
          }
          if (row.variants) {
            row.variants.forEach(item => {
                  item.text = item.text.replace(/Ref\:(.*)/g,'$1').trim();
            });
          }
      }
    }
    return data;
  };
  
  module.exports = { transform };
  