
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
      var rank = 1;
      for (const row of group) {
        if(row.productUrl){
          row.productUrl.forEach(item => {
            item.text='https://www.mediaexpert.pl'+item.text;
          });
        }
        if(row.thumbnail){
          row.thumbnail.forEach(item => {
            item.text='https:'+item.text;
          });
        }
        if(row.aggregateRating){
          var totRatting=0;
      
          row.aggregateRating.forEach(item => {
            if(item.text.indexOf('is-full') !== -1){
              totRatting=totRatting+1;
            }
          });
          row.aggregateRating = [{"text":totRatting, "xpath": row.aggregateRating[0]['xpath']}];
        }
        if(row.brandText){
          var bText;
          row.brandText.forEach(item =>{
            bText=item.text.split(',');
            bText.forEach(item1 =>{
              if(item1.indexOf('"brand":')>-1){
                var bText1=item1.split(':');
                item.text=bText1[1].substring(1, (bText1[1].length-1)) ;
              }
            });
          });
        }
        if(row.id){
          var bText;
          row.id.forEach(item =>{
            bText=item.text.split(',');
            bText.forEach(item1 =>{
              if(item1.indexOf('"id":')>-1){
                var bText1=item1.split(':');
                item.text=bText1[1].substring(1, (bText1[1].length-1)) ;
              }
            });
          });
        }
        if(row.id){
          var bText;
          row.id.forEach(item =>{
            bText=item.text.split(',');
            bText.forEach(item1 =>{
              if(item1.indexOf('"id":')>-1){
                var bText1=item1.split(':');
                item.text=bText1[1].substring(1, (bText1[1].length-1)) ;
              }
            });
          });
        }
        if(row.reviewCount){
          row.reviewCount.forEach(item=>{
            var tmp=item.text.replace('(','');
            item.text=tmp.replace(')','');
          });
        }
        if(row.ratingCount){
          row.ratingCount.forEach(item=>{
            var tmp=item.text.replace('(','');
            item.text=tmp.replace(')','');
          });
        }
        row.rank = [{"text":rank}];
        row.rankOrganic = [{"text":rank}];
        rank++;
      }
    }
    return data;
  };
  
  module.exports = { transform };
  