import csv
import json

voronoi_file = open('data/uk_ltla_voronoi_intersection.geojson')
voronoi = json.load(voronoi_file)['features']

cases_read_file = open('data/hidden/UK Coronavirus Cases 1124.csv')
cases_reader = csv.DictReader(cases_read_file)
cases_reader.fieldnames.append('LTLACellID')

cases_write_file = open('data/hidden/uk_patients.csv', mode='w')
cases_writer = csv.DictWriter(cases_write_file, fieldnames=cases_reader.fieldnames)
cases_writer.writeheader()

for row in cases_reader:
  for vor in voronoi:
    if row['Area code'] == vor['properties']['postcode']:
      row['LTLACellID'] = vor['properties']['cell_id']
      break
  cases_writer.writerow(row)
