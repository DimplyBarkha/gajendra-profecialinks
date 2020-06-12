import pandas
import pdb
if __name__ == "__main__":
    '''
    df = pandas.read_csv("~/Downloads/search.t1.cvs.us.2020-05-17T00_00_00.2020-05-17T00_00_00 (1).csv")
    df2 = pandas.read_csv("~/Downloads/t6.cvs.us.2020-06-11T00_00_00.2020-06-11T00_00_00.csv")
    df["product_code"] = df["product_code"].astype("int")
    df2["product_code"] = df2["product_code"].astype("int")
    dfd = df.drop_duplicates(subset=["product_code"])
    df2d = df2.drop_duplicates(subset=["product_code"])
    '''
    #df = pandas.read_csv("~/Downloads/t1.CVS.us.2020-05-19T00_00_00.2020-05-19T00_00_00 (2).csv", dtype=str)
    #my_df = df[df["sku_number"] == "883465"]
    '''
    Name: 785, Length: 99, dtype: object
(Pdb) df.iloc[783:784]
       # additional_desc_bullet_count additional_desc_bullet_info   ...    vitamin_c_per_serving_uom warnings warranty
783  OLD                          NaN                         NaN   ...                          NaN      NaN      NaN
[1 rows x 99 columns]
(Pdb) df.iloc[783:785]
       # additional_desc_bullet_count additional_desc_bullet_info   ...    vitamin_c_per_serving_uom warnings warranty
783  OLD                          NaN                         NaN   ...                          NaN      NaN      NaN
784  NEW                          0.0                         NaN   ...                          NaN      NaN      NaN
[2 rows x 99 columns]
(Pdb) df.iloc[783:785].to_csv("test.csv")
(Pdb) df.iloc[783:786].to_csv("test.csv")
'''
    df = pandas.read_csv("~/Downloads/DataComparisonReport.csv", dtype=str)
    newdf = df[(df["in_store_price_currency"] == "SUCCESS") & (df["ingredients_list"] == "ERROR")]
    pdb.set_trace()