import json

file_contents = json.loads(open("ranches.json","r").read())

out = []

for d in file_contents["features"]:
    if d["properties"]["Name"] is not None:
        out.append(d)

f = open("out/filtered-ranches.json","w")
file_contents["features"] = out
f.write(json.dumps(file_contents))
