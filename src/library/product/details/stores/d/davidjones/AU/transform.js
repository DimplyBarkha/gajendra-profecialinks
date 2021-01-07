/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
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
    for (const { group } of data) {
        for (const row of group) {
          if (row.termsAndConditions) {                     
            row.termsAndConditions = [
              {
                text: row.termsAndConditions[0].text.toString() == "true" ? "Yes":"No",
              },
            ];
          }
         

          if (row.videos) {
            let text = '';
            row.videos.forEach(item => {
              text += "https://www.davidjones.com"+item.text+"|"; 
            });
            text= text.substring(0,text.length-1);
            row.videos = [
              {
                text: text,
              },
            ];
          }

          if (row.description) {
            let info = [];
            row.description.forEach(item => {
                info.push(item.text.replace(/(\s*\n\s*)+/g, ' | ').trim());
            });
            row.description = [{'text':info.join(' | '),'xpath':row.description[0].xpath}];
          }


          if (row.specifications) {
            let text = '';
            row.specifications.forEach(item => {
                text += item.text+"|"; 
            });
            text= text.substring(0,text.length-1);
            row.specifications = [
              {
                text: text,
              },
            ];
          }

          if(row.aggregateRating){
            let aggregatecount = [];

            row.aggregateRating.forEach(item => {
              item.text = item.text.replace(/[^0-9,.]+/g, " ")
              aggregatecount = item.text.split(" ");
            });
            row.aggregateRating = [{'text': aggregatecount[0],'xpath':row.aggregateRating[0].xpath}];
          }

          if(row.ratingCount){
            let ratingcount = [];

            row.ratingCount.forEach(item => {
              item.text = item.text.replace(/[^0-9,.]+/g, " ")
              ratingcount = item.text.split(" ");
            });
            let size = ratingcount.length -2 ;

            row.ratingCount = [{'text': ratingcount[size],'xpath':row.ratingCount[0].xpath}];
          }

          if(row.secondaryImageTotal){
            let count = 0;

            row.secondaryImageTotal.forEach(item => {
              count++;
            });

            row.secondaryImageTotal = [{'text': count,'xpath':row.secondaryImageTotal[0].xpath}];
          }

        //   if (row.manufacturerDescription) {
        //     let text = '';
        //     row.manufacturerDescription.forEach(item => {
        //       text += item.text.replace(/\s{2,}/g, ' ').replace(/\n/g, ' ').trim();
        //     });
        //     row.manufacturerDescription = [
        //       {
        //         text: text,
        //       },
        //     ];
        //   }
        }
      }
    return data;
  };
  
  module.exports = { transform };
  