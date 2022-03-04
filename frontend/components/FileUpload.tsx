import { Button } from "@material-ui/core";
import React, { useMemo, useState } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";
import { LineReader } from "../src/tools/lineReader"
import FileUploadStyles from "../styles/FileUpload.module.css"

export default function FileUpload() {

  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [rejectedFiles, setRejectedFiles] = useState<FileWithPath[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false)

  async function handleUpload() {
    setIsLoading(true)
    // We handle parsing the data frontend as this is easier to implement.
    setSuccessMessage("")
    setErrorMessage("")
    files.forEach(file => {
      new LineReader(file).readLines(function (line: any) {
        // This LineReader might not be the best choice, but it will do for now. This might be better if we need to handle xlsx https://github.com/SheetJS/sheetjs
        // TODO: format this line into an object, and send it to backend
        // Need to be strict about the format, column names of data will decide what do update in the database.
        // The user will not supply the schoolID, this should be accessible through state. This way we avoid
        // a single user ruining the data in the database. A user can only update his/hers school's data. 
        console.log(line)
      });
    });
    setIsLoading(false)
    const errorHappened = false
    if (errorHappened) setErrorMessage("Filen/filene kunne ikke bli lastet opp, sjekk at innholdet har riktig format")
    else {
      setSuccessMessage("Filen/filene ble lastet opp!")
      setTimeout(() => {
        setSuccessMessage("")
      }, 3000);
    }
    setFiles([])
    setRejectedFiles([])
  }

  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: ".csv, .xlsx",
    onDropAccepted: (acceptedFiles) => {
      setFiles(files.concat(acceptedFiles))
    },
    onDropRejected: (rejectedFiles2) => {
      console.log(rejectedFiles2)
      setRejectedFiles(rejectedFiles.concat(rejectedFiles2))
    }
  });

  const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
  };

  const focusedStyle = {
    borderColor: '#2196f3'
  };

  const acceptStyle = {
    borderColor: '#00e676'
  };

  const rejectStyle = {
    borderColor: '#ff1744'
  };

  const style: any = useMemo(() => ({
    ...baseStyle,
    ...(isFocused ? focusedStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isFocused,
    isDragAccept,
    isDragReject
  ]);

  return (
    <div>
      <section>
        <section>
          <div {...getRootProps({ style })}>
            <input {...getInputProps()} />
            <p>Dra .csv eller .xlxs (Excel) filer hit, eller trykk for å velg filer</p>
          </div>
        </section>

        {files.length !== 0 &&
          <aside>
            <h4>Valgt fil/filer:</h4>
            <ul>{files.map(file => (
              <li key={file.path}>
                {'"' + file.path + '"'} - {file.size} bytes 
              </li>
            ))}</ul>
          </aside>
        }

        {rejectedFiles.length !== 0 &&
          <aside>
            <h4>Kan ikke laste opp:</h4>
            <ul>{rejectedFiles.map(file => (
              <li key={file.path}>
                {'"' + file.path + '"'} - Ugyldig filtype
                {"  ." + file.path!.split(".")[file.path!.split(".").length - 1]}
              </li>
            ))}</ul>
          </aside>
        }

        {files.length !== 0 &&
          <Button type="submit" style={{ background: "#3489eb", color: "white" }} onClick={handleUpload}>
            Last opp fil{files.length > 1 && "er"}
          </Button>
        }

        {successMessage !== "" && <div className={FileUploadStyles.successMessage}><p>{successMessage}</p></div>}
        {errorMessage !== "" && <div className={FileUploadStyles.errorMessage}><p>{errorMessage}</p></div>}

      </section>
    </div>
  );
}
