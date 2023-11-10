import csv
path = "vehicles.csv"
#Read in Data
rows = []
with open(path, newline='') as csvfile:
   reader = csv.reader(csvfile)
   for row in reader:
      rows.append(row)

# #Edit the Data
for i in range(len(rows)-1, 0, -1):
    if rows[i][2] == "":
        del rows[i]
    if i < len(rows)-1:
       if rows[i][3] == rows[i+1][3] and rows[i][4] == rows[i+1][4] and rows[i][7] == rows[i+1][7]:
          del rows[i]


with open(path, 'w', newline='') as csvfile:
   writer = csv.writer(csvfile)
   writer.writerows(rows)