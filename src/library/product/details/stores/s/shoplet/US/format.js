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
      let brandStr='',mpcStr='';
      for (let row of group) {
          if(row.brandText){
              row.brandText.forEach(item=>{
                let obj=JSON.parse(item.text);
                for(let tmpK in obj){
                    if(obj.hasOwnProperty(tmpK)){
                        if(tmpK=='@graph'){
                            let  graphDetails=obj[tmpK];
                             for(let graphDetailsK in graphDetails){
                                if(graphDetailsK==2){
                                    let graphDetailsKItem=graphDetails[graphDetailsK];
                                      //console.log('graphDetailsKItem* :',graphDetailsKItem);
                                    if(graphDetailsKItem.hasOwnProperty('brand')){
                                          //console.log('brand :',graphDetailsKItem['brand'].name);
                                          brandStr=graphDetailsKItem['brand'].name;
                                    }
                                    if(graphDetailsKItem.hasOwnProperty('sku')){
                                          //console.log('sku :',graphDetailsKItem['sku']);
                                    }
                                    if(graphDetailsKItem.hasOwnProperty('mpn')){
                                        //console.log('mpn :',graphDetailsKItem['mpn']);
                                        mpcStr=graphDetailsKItem['mpn'];
                                    }
                                }
                            }
                        }
                    }
                }
                
              })
              row.brandText=[{"text":brandStr}];
              row.mpc=[{"text":mpcStr}];
          } 
          if(row.alternateImages){
              let tmp=0;
              row.alternateImages.forEach(item=>{
                tmp++;
              })
              if(tmp>0)
                row.secondaryImageTotal=[{"text":tmp}];
          }
          if(row.description){
              let inf=[];
              row.description.forEach(item=>{
                  inf.push(item.text);
              })
              row.description=[{"text":inf.join(' | ')}];
              row.descriptionBullets=[{"text":inf.length}];
          }
            if(row.description){
                let inf=[];
                row.description.forEach(item=>{
                    inf.push(item.text);
                })
                row.description=[{"text":inf.join(' | ')}];
            }
            if(row.sku){
                row.sku.forEach(item=>{
                    item.text=item.text.replace('#','');
                })
            }
            if(row.variantId){
                row.variantId.forEach(item=>{
                    item.text=item.text.replace('#','');
                })
            }
            if(row.ratingCount){
                row.ratingCount.forEach(item=>{
                    item.text=item.text.replace('(','').replace(')','');
                })
            }
            if(row.specifications){
                let row2=0, inf=[], tmp='';
                row.specifications.forEach(item=>{
                    if(row2==0){
                        tmp=item.text;
                        row2=1
                    }else if(row2==1){
                        tmp=tmp+" : "+item.text;
                        row2=0;
                        inf.push(tmp);
                        tmp='';
                    }
                })
                row.specifications=[{"text":inf.join(' | ')}];
            }
            if(row.additionalDescBulletInfo){
                let inf=[];
                row.additionalDescBulletInfo.forEach(item=>{
                    inf.push(item.text);
                })
                row.additionalDescBulletInfo=[{"text":inf.join(' | ')}];
            }
            if(row.Image360Present){
                row.Image360Present=[{"text":"Yes"}];
            }
            if(row.videos){
                let vid;let videosAr=[]
                row.videos.forEach(item=>{
                    videosAr=item.text.replace('//img.youtube.com/vi/','').split('/');
                    if(videosAr.length>1){
                        vid=true;
                    }else{
                        vid=false
                    }
                })
                if(vid==true){
                    row.videos=[{"text":"https://youtu.be/"+videosAr[0]}];
                }else{
                    delete row.videos;
                }
            }
      }
    }
    return cleanUp(data);
  };
  module.exports = { transform };