import csv

worldpop = [["id", "name", "population", "fight", "happiness",
             "work", "religion", "family", "friends", "politics", "leisure"]]
data = []

with open('./data/world_population.tsv') as popfile:
    world_population = csv.reader(popfile, delimiter='\t')
    for row in world_population:
        worldpop.append(row)

with open('./old-data/data-2005-2009.tsv') as datafile:
    dataf = csv.reader(datafile, delimiter='\t')
    for row in dataf:
        data.append(row)

for worldrow in worldpop:
    for datarow in data:
        if worldrow[1] == datarow[0]:
            for value in datarow:
                if value != datarow[0]:
                    worldrow.append(value)

with open('./data/data-2005-2009.tsv', 'wt') as out_file:
    tsv_writer = csv.writer(out_file, delimiter='\t')
    for row in worldpop:
        tsv_writer.writerow(row)


"""  
    with open('data-2010-2014.tsv') as datafile:
        data = csv.reader(datafile, delimiter='\t')

    for poprow in world_population:
        for datarow in data:
            if poprow[1] == datarow[0]:
                print(datarow[0])
"""
