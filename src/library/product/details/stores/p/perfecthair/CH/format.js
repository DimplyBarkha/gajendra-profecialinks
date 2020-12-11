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
        
        if (row.aggregateRating) {
          row.aggregateRating.forEach(item => {
            item.text = item.text.replace(/(\s*\.\s*)+/g, ',').trim();
          });
        }

        if (row.listPrice) {
          row.listPrice.forEach(item => {
            //item.text = item.text.replace(/(\s*\.\s*)+/g, ',').trim();
            item.text = item.text.replace(/(\s*\*\s*)+/g, '').trim();
            item.text = item.text.replace(/(\s*CHF\s*)+/g, 'CHF ').trim();
          });
        }
        if (row.price) {
          row.price.forEach(item => {
            //item.text = item.text.replace(/(\s*\.\s*)+/g, ',').trim();
            item.text = item.text.replace(/(\s*\*\s*)+/g, '').trim();
            item.text = item.text.replace(/(\s*CHF\s*)+/g, 'CHF ').trim();
          });
        }
        if (row.productOtherInformation) {
          row.productOtherInformation.map(item => {
            item.text = item.text.replace(/\n /, " ").replace(/\n /gm, "");
          });
        }
        if (row.imageAlt) {
          row.imageAlt.map(item => {
            item.text = item.text.replace(/(\s*Preview:\s*\s*)+/g, '');
          });
        }
        if (row.specifications) {
          row.specifications = [{ text: row.specifications.map(item => item.text.replace(/\n/, "").replace(/\n /gm, "")).join(" | ") ,'xpath':row.specifications[0].xpath}]
        }
        if (row.videos) {
          row.videos = Array.from(new Set(row.videos.map(item => item.text)).values()).map(item => { return { text: item } });
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
        if (row.variantInformation) {
          let info = [];          
          row.variantInformation.forEach(item => {
              info.push(item.text.trim());            
          });
          row.variantInformation = [{'text':info.join(' | '),'xpath':row.variantInformation[0].xpath}];          
        }
        if (row.gtin && row.gtin.length>0) {          
          let item = row.gtin[0];
          var matches = /dataLayer\.push\((.*?)\)\;/isg.exec(item.text);
          console.log(matches[1]);
          if (matches){                
            try {
              let json_data = JSON.parse(matches[1]);
              if (json_data['productEAN']){
                row.gtin = [{'text':json_data['productEAN'],'xpath':row.gtin[0].xpath}];                  
              }
            } catch (error) {
              delete row.gtin;                
            }
          }
          else{
            delete row.gtin;              
          }          
        }
      }
    }
    return cleanUp(data);
  };
  
  module.exports = { transform };