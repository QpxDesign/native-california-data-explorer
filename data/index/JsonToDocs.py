import json
contents = json.loads(open("RanchMetadata.json","r").read())

out = []

index = 1
for d in contents:
    out.append({
        "id":"doc"+str(index),
        "contents": json.dumps(d)
        })
    index += 1
f = open("pre-index.json","w")
f.write(json.dumps(out))
