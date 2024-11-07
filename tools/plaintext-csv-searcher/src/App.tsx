import React, { useState, useEffect } from "react";
import { ReadFile } from "./utils/ReadFile";
import { Table } from "./components/Table";
import { ParseSearch } from "./utils/ParseSearch";
import { Row } from "./structs/Row";
import "./App.css";

function App() {
  const [search, setSearch] = useState<string>("");
  const [file, setFile] = useState<FileList | null>(null);
  const [fileContents, setFileContents] = useState<Array<Row>>([]);
  function resetFilters() {
    let c = structuredClone(fileContents);
    c.forEach((f: Row) => (f.display = true));
    setFileContents([...c]);
  }

  useEffect(() => {
    if (file !== null && file?.length !== 0) {
      ReadFile(file[0]).then((f) => setFileContents(f));
    }
  }, [file]);
  useEffect(() => {
    let a = ParseSearch(search, fileContents);
    if (a !== null) {
      setFileContents([...a]);
    }
  }, [search]);
  return (
    <div className="App">
      <div className="full-center">
        <label className="file-upload">
          <input
            onChange={(e) => {
              setFile(e?.target.files);
            }}
            type="file"
            style={{
              fontSize: "1.5em",
              flex: 0,
            }}
          />
          Upload File (.csv)
        </label>
        <textarea
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          rows={5}
          placeholder="Search query"
          style={{
            fontSize: "1em",
            flex: 1,

            margin: 0,
            border: "3px solid black",
            borderRadius: "1em",
          }}
        />
        <button
          onClick={() => {
            resetFilters();
          }}
        >
          Reset
        </button>
      </div>
      <Table data={fileContents} />
    </div>
  );
}

export default App;
