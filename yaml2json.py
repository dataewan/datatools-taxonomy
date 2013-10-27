import yaml
import json
import sys

class Converter:
    """Converter changes the CSV file to yaml format. This makes it easier to add comments in."""
    def __init__(self, yamlfilename):
        self.yamlfilename = yamlfilename
        self.form_io_connections()
        self.convert()
        self.output_and_complete()

    def form_io_connections(self):
        self.yamlfile = open(self.yamlfilename, "rb")
        self.outfile = open("ratings.json", "wb")

    def convert(self):
        self.results = yaml.load(self.yamlfile)

    def output_and_complete(self):
        json.dump(self.results, self.outfile, indent=2)
        self.outfile.close()


if __name__ == "__main__":
    csvfile = sys.argv[1]
    c = Converter(csvfile)
