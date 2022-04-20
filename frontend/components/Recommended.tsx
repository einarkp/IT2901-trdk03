import { getData } from '../utils/APIUtils';
import { useEffect, useState } from 'react'
import { schoolData} from '../Interfaces'
import styles from '../styles/rec.module.css'
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { $mobx } from 'mobx';





export default function Recommended() {


    const [schoolDataArr, setSchoolDataArr]: any[] = useState([])

    function getSchoolArr(schoolSimiliar: number[]){
        var tempArr: any[] = []
        for (let i = 0; i<schoolSimiliar.length; i++){
                getData("schools/" + schoolSimiliar[i])
                .then((response) => {
                    const schooldata:schoolData = response.data;

                    tempArr.push(schooldata)
                })
                .catch((e) => { console.log(e) }); 
            
            }
            console.log(tempArr) 
        setSchoolDataArr(tempArr)   
        }

    useEffect(() => {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries());
    
        getData("schools/" + params.id)
        .then((response) => {
            const schooldata:schoolData = response.data

            
            if(schooldata.schoolSimiliar != []){   
                getSchoolArr(schooldata.schoolSimiliar)
            }
        })
        .catch((e) => { console.log(e) }); 
       },[] )

  return (<>
    {schoolDataArr.length != 0 && 



    <div className={styles.cardContainer}>

        {schoolDataArr.map((item: any,key: number)=>
               { 
    return     <div key={key} >
                <Card sx={{ minWidth: 275 }}>
                    <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        {item.name}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        Er skolen stor?
                    </Typography>
                    <Typography variant="body2">
                        Denne skolen er stor!   
                    </Typography>
                    </CardContent>
                    <CardActions>
                    <Button size="small"><a href={ 'http://localhost:3000/totalOversikt?id=' + String(item.responsibility) }>Se denne fine skolen</a></Button>
                    </CardActions>
                </Card></div>

                })}
    </div>

    }
  </>)
}