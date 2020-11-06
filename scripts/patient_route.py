import pandas as pd
import geopandas as gpd
import numpy as np
import pyproj
from fiona.crs import from_epsg

voronoi = [
  gpd.read_file('data/kr_village_voronoi_intersection.geojson'),
  gpd.read_file('data/kr_city_county_voronoi_intersection.geojson'),
  gpd.read_file('data/kr_province_voronoi_intersection.geojson')
]

route = gpd.read_file('data/hidden/patient_route_1106.csv')
route = route.replace('', np.nan).dropna(subset=['Latitude', 'Longitude'])
route_geom = gpd.points_from_xy(route.Longitude, route.Latitude)
route_frame = gpd.GeoDataFrame(route, geometry=route_geom, crs=from_epsg(4326))

cell_data = [{}, {}, {}]
for index, row in route_frame.iterrows():
  for i in range(len(voronoi)):
    cell_data[i][index] = list(voronoi[i][voronoi[i].contains(row.geometry)]['cellid'])[0]
route_frame['VillageCellID'] = pd.Series(list(cell_data[0].values()), index=list(cell_data[0].keys()), dtype=np.dtype('int32'))
route_frame['CityCellID'] = pd.Series(list(cell_data[1].values()), index=list(cell_data[1].keys()), dtype=np.dtype('int32'))
route_frame['ProvinceCellID'] = pd.Series(list(cell_data[2].values()), index=list(cell_data[2].keys()), dtype=np.dtype('int32'))
#route_frame.assign(emdlid=series)
print(route_frame)
route_frame.drop(['geometry', 'PlaceName', 'Memo'], axis=1).to_csv('data/hidden/patient_route_cellid_output.csv')
