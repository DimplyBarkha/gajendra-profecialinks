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
        if(row.descriptionBullets){
          var tot=0;var info=[];
          row.descriptionBullets.forEach(item => {
            tot++; info.push(item.text);
          });
          row.descriptionBullets=[{"text":tot}];
          row.additionalDescBulletInfo=[{"text":info.join(' | ')}];
        }
        if(row.ingredientsList){
          var dataTot=0;var info=[]; var dataStr='';
          row.ingredientsList.forEach(item=>{
            dataTot++;
            if(dataTot==1){
              dataStr=item.text;
            }
            if(dataTot==2){
              dataStr=dataStr+" :"+item.text;
              info.push(dataStr);
              dataStr='';dataTot=0;
            }
          })
          row.ingredientsList=[{"text":info.join(' || ')}];
        }
      }
    }
    return cleanUp(data);
  };
  module.exports = { transform };