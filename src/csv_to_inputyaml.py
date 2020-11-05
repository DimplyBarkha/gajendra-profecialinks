import csv
import sys
if __name__ == "__main__":
    if( len(sys.argv) != 2 ):
        print("\nUsage: python3 csv_to_inputyaml.py <yourcsv>.csv\n")
        quit()
    #print(sys.argv[1])
    with open(sys.argv[1]) as csv_file:
        csv_reader = csv.reader(csv_file)
        line_count = 0
        columns = []
        for row in csv_reader:
            if(line_count == 0):
                columns = row
            elif( len(row) != len(columns)):
                continue
            else:
                line_str = f"input{line_count}:"
                for ix, column in enumerate(columns):
                    line_str += f"\n  {column}: {row[ix]}"
                print(line_str)
            line_count += 1
