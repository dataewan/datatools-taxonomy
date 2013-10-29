"""
Takes the comments out of the yaml file and sticks them somewhere else. This is good for the `csv2yaml.py` script, because it won't clobber over the old comments.
"""

import yaml

infile = open("ratings.yaml", "rb")
outfile = open("comments.yaml", "wb")

data = yaml.load(infile)

results = {}

for row in data:
    tool = row['Tool']
    results[tool] = {}
    for k,v in row['Ratings'].iteritems():
        category = k
        comment  = v['comment']

        results[tool][category] = comment

yaml.dump(results, outfile)

outfile.close()

