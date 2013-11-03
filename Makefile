newcomment:
	python strip_comments.py
	python yaml2json.py ratings.yaml
updateratings:
	python csv2yaml.py ratings.csv
	python yaml2json.py ratings.yaml
