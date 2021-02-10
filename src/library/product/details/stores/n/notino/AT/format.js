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
          
          if (row.mpc) {            
            row.mpc.forEach(item => {
              item.text = item.text.replace(/(\s*Code\s*\:\s*)+/g, '').trim()
            });          
          }
          
          if (row.variants) {
            let info = [];
            row.variants.forEach(item => {
                info.push(item.text.replace(/(\s*pd-variant-\s*)+/g, '').trim());
            });
            row.variants = [{'text':info.join(' | '),'xpath':row.variants[0].xpath}];   
          }
          if (row.variantInformation) {
            let info = [];
            row.variantInformation.forEach(item => {
                info.push(item.text.trim());
            });
            row.variantInformation = [{'text':info.join(' | '),'xpath':row.variantInformation[0].xpath}];   
          }
          if (row.description) {
            let info = [];          
            row.description.forEach(item => {
              info.push(item.text.replace(/(\s*\n\s*)+/g, ' | ').trim());            
            });
            row.description = [{'text':info.join(' | '),'xpath':row.description[0].xpath}];          
          }
        }
    }
    return cleanUp(data);
  };
  
  module.exports = { transform };