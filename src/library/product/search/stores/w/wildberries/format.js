/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  const state = context.getState();
  let rankCounter = state.rankCounter || 0;
    for (const { group } of data) {
      for (const row of group) {
        try {
            if (row.price && row.price[0]) {
              row.price[0].text = row.price[0].text !="" ? `${row.price[0].text.split("₽")[0].trim().split(' ').join(',')} ₽` :  "";
            }

            if (row.thumbnail) {
                let loadedImageUrl = "";
                row.thumbnail.map(item=>{
                    loadedImageUrl += `https:${item.text}`;
                })
                row.thumbnail = [
                  {
                    text: loadedImageUrl
                  },
                ];
              }
              rankCounter = rankCounter + 1;
              row.rank = [{ text: rankCounter }];
              context.setState({ rankCounter });
        }
        catch(exception){
            console.log(exception);
        }

      }
    }
    return data;
  };
  
  module.exports = { transform };