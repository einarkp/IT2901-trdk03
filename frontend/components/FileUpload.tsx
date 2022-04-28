import { Button } from "@material-ui/core";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useDropzone, FileWithPath, FileRejection } from "react-dropzone";
import FileUploadStyles from "../styles/FileUpload.module.css"
import Excel from "exceljs"
import { CreatePredictions, UpdateDatabase } from "../utils/APIUtils";
import { RotatingSquare } from "react-loader-spinner";
import { StoreContext } from '../pages/_app';
import accountingGuide from '../images/regnskapguide.png';
import Image from 'next/image'

export default function FileUpload() {

  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [rejectedFiles, setRejectedFiles] = useState<FileRejection[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false)
  let objectsToAddToDb: { type: string; data: { schoolId: number; month: number; year: number; amount: number; }; }[] = []
  let schoolId: number = 0
  const store = useContext(StoreContext)
  if (store.activeUser?.schoolID != 0) schoolId = Number(store.activeUser?.schoolID) // schoolId = 0 means no connected school

  function processExcelRow(currentDataRow: any, metaInfoArr: string[], dataType: string, dataTypeColumnName: string) {
    if (schoolId === 0) throw "Brukeren din er ikke knyttet til en skole, kontakt administrator"
    if (dataType === "") return
    const objectToSend = {
      schoolId: schoolId,
      month: -10,
      year: -10,
      amount: -10,
    }
    // Find month and year, either they exist as separate columns or as part of full date column
    if (metaInfoArr.includes("år") && metaInfoArr.includes("måned")) {
      objectToSend.month = Number(currentDataRow[metaInfoArr.indexOf("måned")])
      objectToSend.year = Number(currentDataRow[metaInfoArr.indexOf("år")])
      if (!(objectToSend.month > 0 && objectToSend.month < 13)) {
        throw "Ugyldig månedverdi. Du kan også inkludere et datofelt med formatet: '19.12.2022' og kolonnenavn 'Dato'."
      }
      if (!(objectToSend.year > 1000)) {
        throw "Ugyldig årverdi. Du kan også inkludere et datofelt med formatet: '19.12.2022' og kolonnenavn 'Dato'."
      }
    }
    else if (metaInfoArr.includes("dato")) {  // Assume format: "19.12.2022"
      const date = currentDataRow[metaInfoArr.indexOf("dato")]
      if (Object.prototype.toString.call(date) !== "[object Date]")
        throw "Ugyldig datoformat, gyldig format er '19.12.2022'. Du kan også inkludere måned og år som separate kolonner."
      objectToSend.month = date.getMonth() + 1
      objectToSend.year = date.getFullYear()
    }
    else {
      throw "Fant ingen datokolonne. Du kan enten inkludere separate kolonner for 'Måned' og 'År', eller en 'Dato' kolonne med format: '19.12.2022'."
    }
    objectToSend.amount = Number(currentDataRow[metaInfoArr.indexOf(dataTypeColumnName)])
    if (isNaN(objectToSend.amount)) {
      throw "Ugyldig verdi, sjekk at verdien er et gyldig tall"
    }
    objectsToAddToDb.push({ type: dataType, data: objectToSend })
  }

  async function handleUpload() {
    // We handle parsing the data frontend as this is easier to implement.
    setIsLoading(true)
    setSuccessMessage("")
    setErrorMessage("")
    let metaInfoArr: string[] = []
    let dataType = "" // Either "accountings", "budgets" etc. (matches backend)
    let dataTypeColumnName = "" // Either "budsjett", "regnskap"
    let errorMessage = ""
    let currentFile = 0
    const allFilePromise = new Promise((resolve, reject) => {
      files.forEach(async file => {
        currentFile++;
        const typeOfFile = file.path?.split(".")[file.path?.split(".").length - 1]
        if (typeOfFile === "xlsx") {
          const wb = new Excel.Workbook();
          const reader = new FileReader()
          reader.readAsArrayBuffer(file)
          reader.onload = () => {
            const buffer = reader.result;
            if (buffer === null || typeof buffer === 'string') {
              return
            }
            wb.xlsx.load(buffer).then(workbook => {
              const sheet = workbook.worksheets[0]
              const lengthOfWorksheet = sheet.actualRowCount
              sheet.eachRow(async (row, rowIndex) => {
                // IMPORTANT: this only iterates rows that have values in every column that has a name, no specific error is throw for this. 
                // This can just be mentioned in the user interface.
                const currentDataRow: any = row.values  // List of row values e.g [19.02.2021, 23412424, 10100]
                if (rowIndex === 1) {  // Set metaInfoArr containing column names
                  metaInfoArr = []
                  dataType = ""
                  Object.entries(currentDataRow).map((item: any) => {
                    if (typeof item[1] === "string") metaInfoArr.push(item[1].toLowerCase())
                    else metaInfoArr.push(item[1])
                  })
                  // Find data type:
                  if (metaInfoArr.includes("regnskap")) { dataType = "accountings"; dataTypeColumnName = "regnskap" }
                  else if (metaInfoArr.includes("budsjett")) { dataType = "budgets"; dataTypeColumnName = "budsjett" }
                  if (dataType === "") {
                    errorMessage = '"' + file.path + '", linje 1: ' + "Fant ingen kolonne med en av de obligatoriske verdiene: 'Budsjett', 'Regnskap'"
                    reject("")
                  }
                }
                else {
                  try {
                    processExcelRow(currentDataRow.filter((n: number) => n), metaInfoArr, dataType, dataTypeColumnName)
                    // Resolve promise when last line of last file is parsed
                    if (rowIndex === lengthOfWorksheet && currentFile == files.length) resolve("")
                  } catch (error) {
                    errorMessage = '"' + file.path + '", linje ' + rowIndex + ": " + error
                    reject(error)
                  }
                }
              })
            })
          }
        }
      });
    })
    await allFilePromise.then(async () => {
      // If no error, update database with objects from objectsToAddToDb:
      if (errorMessage !== "") throw "Error"
      let needToCreateNewPredictions = false
      let schoolsToCreatePredictions: number[] = []
      for (const object of objectsToAddToDb) {  // TODO: need to handle db insert error? Maybe not that useful?
        if (object.type === "accountings") {
          needToCreateNewPredictions = true
          if (!schoolsToCreatePredictions.includes(object.data.schoolId)) schoolsToCreatePredictions.push(object.data.schoolId)
        }
        await UpdateDatabase(object.type, [object.data])
      }
      if (needToCreateNewPredictions) {
        for (const schoolId of schoolsToCreatePredictions) {
          await CreatePredictions(schoolId)
        }
      }
      setIsLoading(false)
      setSuccessMessage("Filen/filene ble lastet opp!")
      setTimeout(() => {
        setSuccessMessage("")
      }, 3000);
      setFiles([])
      setRejectedFiles([])
      objectsToAddToDb = []

    }).catch((error) => {
      // Error happened:
      console.log(error)
      setFiles([])
      setRejectedFiles([])
      setErrorMessage(errorMessage)
      setIsLoading(false)
    })
  }

  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: ".xlsx",
    onDropAccepted: (acceptedFiles) => {
      setFiles(files.concat(acceptedFiles))
    },
    onDropRejected: (rejectedFile) => {
      setRejectedFiles(rejectedFiles.concat(rejectedFile))
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
    borderColor: '#aaaaaa',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out',
    cursor: "pointer"
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
    <div className={FileUploadStyles.content}>
      <section className={FileUploadStyles.dropzoneContainer}>
        <section>
          <div {...getRootProps({ style })}>
            <input {...getInputProps()} />
            <p>Dra .xlxs (Excel) filer hit, eller trykk for å velg filer</p>
          </div>
        </section>

        {files.length !== 0 && !isLoading &&
          <aside>
            <h4>Valgt fil/filer:</h4>
            <ul>{files.map(file => (
              <li key={file.path}>
                {'"' + file.path + '"'} - {file.size} bytes
              </li>
            ))}</ul>
          </aside>
        }

        {rejectedFiles.length !== 0 && !isLoading &&
          <aside>
            <h4>Kan ikke laste opp:</h4>
            <ul>{rejectedFiles.map(file => (
              <li key={file.file.name}>
                {'"' + file.file.name + '"'} - Ugyldig filtype
                {"  ." + file.file.name!.split(".")[file.file.name!.split(".").length - 1]}
              </li>
            ))}</ul>
          </aside>
        }

        {files.length !== 0 && !isLoading &&
          <Button type="submit" style={{ background: "#3489eb", color: "white" }} onClick={handleUpload}>
            Last opp fil{files.length > 1 && "er"}
          </Button>
        }
        {/* Plenty of loading icons to choose from: https://mhnpd.github.io/react-loader-spinner/tail-spin */}
        {isLoading && <div style={{ display: "flex", alignItems: "center" }}>  <RotatingSquare ariaLabel="rotating-square" visible={isLoading} color="#3489eb" /> Dataen blir lastet opp, ikke lukk vinduet!</div>}

        {successMessage !== "" && <div className={FileUploadStyles.successMessage}><p>{successMessage}</p></div>}
        {errorMessage !== "" && <div className={FileUploadStyles.errorMessage}><p>{errorMessage}</p></div>}


      </section>

      <div>
        <h1 className={FileUploadStyles.title}>Last opp ny data</h1>
        <p>Du kan laste opp (eller oppdatere) regnskap- og budsjettdata fra Excel slik: </p>

        <Image src={accountingGuide} alt="regnskapguide" />
        <p>Datokolonnen kan erstattes med to separate kolonner for «Måned» og «År». <br />
        For å laste opp budsjett bytter du ut "Regnskap"-kolonnen med "Budsjett".</p>
        <p>Det kan kun eksistere én regnskapsverdi for en måned, og én budsjettverdi per år.</p>
      </div>
    </div>
  );
}
