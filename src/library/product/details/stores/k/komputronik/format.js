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

      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          item.text = item.text.replace(/(product-picture\/4\/)+/g, 'product-picture/11/').trim();
        });
        if(row.alternateImages.length > 1){
          row.alternateImages.splice(0,1);
        }else{
          delete row.alternateImages;
        }
      }
      if (row.category) {
        row.category.forEach(item => {
          item.text = item.text.replace(/(\s*\n\s*)+/g, '');
        });
      }
      if (row.variantinformation) {
        let info = [];
        row.variantinformation.forEach(item => {
          info.push(item.text.replace(/(\s*\n\s*)+/g, '').trim());
        });
        row.variantinformation = [{ 'text': info.join(' || '), 'xpath': row.variantinformation[0].xpath }];
      }
      if (row.variants) {
        row.variants.forEach(item => {
          item.text = item.text.replace(/(\s*\n\s*)+/g, ' | ').trim();
        });
      }
      if (row.description) {
        row.description.forEach(item => {
          item.text = item.text.replace(/(\s*\n\s*)+/g, ' || ').trim();
        });
      }
      if (row.specifications) {
        let info = [];
        row.specifications.forEach(item => {
          item.text = item.text.replace(/(.+)Gwarancja+/isg, 'Gwarancja')
          info.push(item.text.replace(/(\s*\n\s*)+/g, ' : ').trim());
        });
        row.specifications = [{ 'text': info.join(' || '), 'xpath': row.specifications[0].xpath }];
      }
      if (row.descriptionBullets) {
        row.descriptionBullets = [{'text':row.descriptionBullets.length, 'xpath':row.descriptionBullets[0].xpath}];              
      }      
    }
  }
  return cleanUp(data);
};
module.exports = { transform };
