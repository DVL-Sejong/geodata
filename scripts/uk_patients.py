import csv
import json
import requests
from datetime import date

file_date = date.today().strftime("%m%d")

regions_file = open('data/uk_ltla_list.csv')
regions_reader = csv.DictReader(regions_file)

voronoi_file = open('data/uk_ltla_voronoi_intersection.geojson')
voronoi = json.load(voronoi_file)['features']

cases_data = []
for region in regions_reader:
  region_name = region['LAD18NM']
  region_code = region['LAD18CD']
  region_cell_id = -1

  for vor in voronoi:
    if region_code == vor['properties']['postcode']:
      region_cell_id = vor['properties']['cell_id']
  if region_cell_id == -1:
    print(f'Warning: cell not found - {region_name}({region_code})')

  endpoint = (
    'https://api.coronavirus.data.gov.uk/v1/data?'
    f'filters=areaType=ltla;areaName={region_name}&'
    'structure={"date":"date","newCases":"newCasesBySpecimenDate","cumCases":"cumCasesBySpecimenDate"}'
  )

  response = requests.get(endpoint, timeout=10)

  if response.status_code >= 400:
    raise RuntimeError(f'Request failed: {response.text}')
  if response.status_code == 200:
    response_data = response.json()['data']
    '''try:
      response_data = response.json()['data']
    except:
      print(f'Warning: {response.json()}')
      continue'''

    for row in response_data:
      cases_data.append({
        'Specimen date': row['date'],
        'New cases': row['newCases'],
        'Area name': region_name,
        'Area code': region_code,
        'Area type': 'ltla',
        'Cell ID': region_cell_id
      })

file_name = f'data/hidden/uk_patients_{file_date}.csv'
cases_file = open(file_name, mode='w')
cases_writer = csv.DictWriter(cases_file, fieldnames=cases_data[0].keys())
cases_writer.writeheader()
for row in cases_data:
  cases_writer.writerow(row)
print(file_name)