import json
from shapely.geometry import shape, Point
from lat_lon_parser import parse
from tqdm import tqdm
import uuid

with open('out/filtered-ranches.json') as f:
    polygons = json.load(f)
with open('out/RanchMetadata.json') as f:
    metadata = json.load(f)

out = []
for entry in tqdm(metadata):
    if "Coordinates" not in entry:
        continue;
    c = entry["Coordinates"]
    c = c.replace("W ", "")
    c = c.replace("/", "W /")
    c = c.replace(",", "W ,")
    c = c.replace("N", "")
    c += " N"
    if "," in c:
        c = c.split(',')[0]
    lat = c.split("/")[1]
    long = c.split("/")[0]
    try:
        point = Point(parse(long), parse(lat))
    except:
        print("ERROR")
        continue;
    for pg in polygons["features"]:
        polygon = shape(pg['geometry'])
        if polygon.contains(point):
            q_id = uuid.uuid4()
            entry["q_id"] = str(q_id)
            pg["properties"]["q_id"] = str(q_id)
            out.append(entry)
            continue;

out_pg = []

for pg in polygons["features"]:
    if "q_id" not in pg["properties"]:
        pg["properties"]["q_id"] = "none"
    out_pg.append(pg)

f1 = open("out/RANCHES_WITH_QID.json","w")
f2 = open("out/METADATA_WITH_QID.json","w")

polygons["features"] = out_pg

f1.write(json.dumps(out))
f2.write(json.dumps(polygons))
