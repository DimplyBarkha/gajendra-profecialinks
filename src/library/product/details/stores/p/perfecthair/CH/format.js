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
        if (row.color) {
          row.color = [{ text: row.color.map(item => item.text).join() }]
        }
        
        
        if (row.productOtherInformation) {
          row.productOtherInformation.map(item => {
            item.text = item.text.replace(/\n /, " ").replace(/\n /gm, "");
          });
        }
        if (row.specifications) {
          row.specifications = [{ text: row.specifications.map(item => item.text.replace(/\n/, "").replace(/\n /gm, "")).join(" | ") ,'xpath':row.specifications[0].xpath}]
        }
        if (row.videos) {
          row.videos = Array.from(new Set(row.videos.map(item => item.text)).values()).map(item => { return { text: item } });
        }
        if (row.manufacturerImages) {
            let info = [];          
            row.manufacturerImages.forEach(item => {
                info.push(item.text);            
            });
            row.manufacturerImages = [{'text':info.join(' | '),'xpath':row.manufacturerImages[0].xpath}];          
        }
        if (row.manufacturerDescription) {
            let info = [];          
            row.manufacturerDescription.forEach(item => {
                info.push(item.text);            
            });
            row.manufacturerDescription = [{'text':info.join(' | '),'xpath':row.manufacturerDescription[0].xpath}];          
        }
        if (row.description) {
            let info = [];          
            row.description.forEach(item => {
                info.push(item.text.replace(/(\s*\n\s*)+/g, ' ').trim());            
            });
            row.description = [{'text':info.join(' | '),'xpath':row.description[0].xpath}];          
        }
      }
    }
    return cleanUp(data);
  };
  
  module.exports = { transform };