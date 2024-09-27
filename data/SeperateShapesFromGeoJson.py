import sys
import json
import uuid

file_contents = json.loads(open(sys.argv[1], "r").read())

file_count = 0
key = []
for feature in file_contents["features"]:
    file_count += 1
    file_name = sys.argv[1].split(".")[0] + "_" + str(file_count) + ".geojson"
    a = open("out/SeperateGeojson/" + file_name, "w")
    a.write(json.dumps(feature))
    key.append({
        "kind": "shape",
        "title": feature["properties"]["Name"],
        "id": str(uuid.uuid4()),
        "alt_text": feature["properties"]["Name"],
        "shape_file_slug": "/assets/shapefiles/" + file_name
        })
o = open("out/SeperateGeojsonKey.json","w")
o.write(json.dumps(key))
