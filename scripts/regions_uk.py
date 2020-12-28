import csv
import json
import requests

region_list = []
type_list = []
regions = {}

geodata = {
  'type': 'FeatureCollection',
  'features': []
}

with open('./data/uk_ltla_list.csv') as csv_file:
  next(csv_file)
  reader = csv.reader(csv_file)

  for index, region_data in enumerate(reader):
    region_postcode = region_data[0]
    region_name = region_data[1]
    region_fid = region_data[3]
    region_type = 'ltla'
    region_country = 'UK'

    response = requests.get(f'https://findthatpostcode.uk/areas/{region_postcode}.json')

    if response.status_code >= 400:
      raise RuntimeError(f'Request failed: {response.text}')
    if response.status_code == 200:
      response_data = response.json()
      name = response_data['data']['attributes']['name']
      location = response_data['included'][0]['attributes']['location']

      feature = {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [float(location['lon']), float(location['lat'])]
        },
        'properties': {
          'fid': region_fid,
          'cell_id': index,
          'name': response_data['data']['attributes']['name'],
          'type': 'ltla',
          'postcode': region_postcode
        }
      }
      geodata['features']

    if region_type not in type_list:
      type_list.append(region_type)
      regions[region_type] = []
    if region_name not in region_list:
      region_list.append(region_name)
      regions[region_type].append({
        'name': region_name,
        'type': region_type,
        'postcode': region_postcode
      })

for region_type in type_list:
  geodata = {
    'type': 'FeatureCollection',
    'features': []
  }
  for index, region in enumerate(regions[region_type]):
    osm = nominatim.query(f"{region['name']}, England")

    osm = osm.toJSON()[0]
    feature = {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [float(osm['lon']), float(osm['lat'])]
      },
      'properties': {
        'osmid': osm['osm_id'],
        'cell_id': index,
        'name': region['name'],
        'type': region['type'],
        'postcode': region['postcode']
      }
    }
    geodata['features'].append(feature)

  with open(f'./data/uk_{region_type}_osm.geojson', 'w', encoding='utf-8') as json_file:
    dump = json.dumps(geodata, ensure_ascii=False)
    json_file.write(dump)
    print(f'[osm-{region_type}] output:', len(geodata['features']))
