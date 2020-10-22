

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
  for (const { group} of data) {
      for (let row of group) {        
                    
          if (row.specifications) {
            let info = [];          
            row.specifications.forEach(item => {
              info.push(item.text);            
            });          
            row.specifications = [{'text':info.join(' || '),'xpath':row.specifications[0].xpath}];          
          }
          if (row.description) {
            row.description.forEach(item => {
                item.text  = item.text.replace(/(\s*\n\s\n\s*)/g, '  ').trim();
            });
          }
          if (row.aggregateRating) {
            row.aggregateRating.forEach(item => {
                item.text  = item.text.replace(/\./g, ',').trim();
            });
          }
          
          if (row.additionalDescBulletInfo) {
            let info = [];          
            row.additionalDescBulletInfo.forEach(item => {
              info.push(item.text.replace(/(\s*\n\s*)+/g, ' ').trim());            
            });
            row.additionalDescBulletInfo = [{'text':info.join(' || '),'xpath':row.additionalDescBulletInfo[0].xpath}];          
          }
          if (row.descriptionBullets) {
            let info = [];          
            row.descriptionBullets.forEach(item => {
              info.push(item.text.replace(/(\s*\n\s*)+/g, ' ').trim());            
            });
            row.descriptionBullets = [{'text':info.length,'xpath':row.descriptionBullets[0].xpath}];          
          }
          if (row.productHeight){
            console.log("hi....");
            let dim = "H x W x D : ";
            row.productHeight.forEach(item => {
              dim += item.text;
            });
            row.productWidth.forEach(item => {
              dim += ' x ' + item.text;
            });
            row.productDepth.forEach(item => {
              dim += ' x ' + item.text;
            });
            row.shippingDimensions = [{'text':dim,'xpath':row.productHeight[0].xpath}];
            delete row.productHeight
            delete row.productWidth
            delete row.productDepth
          }
      }
    }
    return cleanUp(data);
};

module.exports = { transform }