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
        var bulletInfo=[];
        if(row.description){
            row.description.forEach(item=>{
                var itemArr=item.text.split('\n');
                item.text=item.text.replace('\n',' || ');
                itemArr.forEach(element => {
                    console.log('**:',element);
                    if(element.indexOf(". ")==0){
                        console.log('adding bullet data :',element);
                        var tmp=element.replace('. ','');
                        console.log('before push remove bullet data : ',tmp);
                        bulletInfo.push(tmp);
                    }
                });
                console.log('bulletInfo :',bulletInfo);
            })
        }
        if(bulletInfo.length>0){
            row.descriptionBullets=[{"text":bulletInfo.length}];
            row.additionalDescBulletInfo=[{"text":"|| "+bulletInfo.join(' || ')}];
        }else{
            delete row.additionalDescBulletInfo;
            delete row.descriptionBullets;
        }
      }
    }
    return cleanUp(data);
  };
  module.exports = { transform };