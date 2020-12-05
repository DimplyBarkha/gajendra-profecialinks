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
        if (row.availabilityText) {                    
          row.availabilityText.forEach(item => {
            item.text = "In Stock";
          });          
        }
        if (row.secondaryImageTotal) {                    
          row.secondaryImageTotal.forEach(item => {
            item.text = Number(item.text);
          });          
        }
        if (row.specifications) {
          let info = [];
          row.specifications.forEach(item => {
            info.push(item.text.trim());
          });
          row.specifications = [{'text':info.join(' | '),'xpath':row.specifications[0].xpath}];
        }
        if (row.size) {
          let sizeinfo = [];
          row.size.forEach(item => {
            sizeinfo.push(item.text.trim());
          });
          row.size = [{'text':sizeinfo.join(' | '),'xpath':row.size[0].xpath}];
        }
        if (row.variants) {
          let variantsinfo = [];
          row.variants.forEach(item => {
            variantsinfo.push(item.text.trim());
          });
          row.variants = [{'text':variantsinfo.join(' | '),'xpath':row.variants[0].xpath}];
        }
        if (row.secondary_image_total) {                    
          row.secondary_image_total.forEach(item => {
            item.text = Number(item.text-1);
          });          
        }
      }
    }
    return cleanUp(data);
  };
  
  module.exports = { transform };