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
      if(row.nameExtended){
        let tmpName='';
        row.nameExtended.forEach(item=>{
          if(tmpName==''){
            tmpName=item.text;
          }else{
            tmpName=tmpName+' - '+item.text;
          }
        })
        row.nameExtended=[{"text":tmpName}];
      }
      if(row.variants){
        let inf=[];
        row.variants.forEach(item=>{
          inf.push(item.text);
        })
        row.variants=[{"text":inf.join(' | ')}];
        row.variantCount=[{"text":inf.length}];
      }else{
        row.variantCount=[{"text":0}];
      }
    }
  }
  return cleanUp(data);
};
module.exports = { transform };