import csv
import os
import yaml
import sys

class Converter:
    """Converter changes the CSV file to yaml format. This makes it easier to add comments in."""
    def __init__(self, csvfilename):
        self.csvfilename = csvfilename
        self.form_io_connections()
        self.read_comments()
        self.convert()
        self.output_and_complete()

    def form_io_connections(self):
        self.csvfile = open(self.csvfilename, "rb")
        self.csvreader = csv.DictReader(self.csvfile)
        self.outfile = open("ratings.yaml", "wb")

    def read_comments(self):
        """
        Reads the pre-existing comments file (if it exists)
        """
        if os.path.exists("comments.yaml"):
            self.comments = yaml.load(open("comments.yaml", "rb"))
        else:
            self.comments = None

    def convert(self):
        self.results = []
        for row in self.csvreader:
            result = {}
            result['Tool'] = row['Tool']
            result['Type'] = row['Type']
            result['Ratings'] = {}
            keys = row.keys()
            keys.remove('Tool')
            keys.remove('Type')

            for key in keys:
                if row['Tool'] in self.comments:
                    if key in self.comments[row['Tool']]:
                        result['Ratings'][key] = {
                            'category' : key,
                            'rating' : int(row[key]),
                            'comment': self.comments[row['Tool']][key]
                            }

                else:
                    result['Ratings'][key] = {
                        'category' : key,
                        'rating' : int(row[key]),
                        'comment': ''
                        }
            self.results.append(result)

    def output_and_complete(self):
        yaml.dump(self.results, self.outfile, default_flow_style = False)
        self.outfile.close()


if __name__ == "__main__":
    csvfile = sys.argv[1]
    c = Converter(csvfile)
