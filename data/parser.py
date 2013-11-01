#!/usr/bin/env python

import json, urllib
json_data = open("indicators.json")
data = json.load(json_data)

#Initalizing HTML content
html = ''
index  = 0
for i in range(0, 80):
	html += '<option value="' + data[1][10*i]["id"] + '">'
	html += data[1][10*i]["name"] + '</option>'
	index += 1

f = open('dropdown.txt', 'r+')
f.write(str(html.encode('utf-8')))

print `index` + ' records added to dump file'