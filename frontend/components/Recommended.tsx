import { getData } from '../utils/APIUtils';
import { useEffect, useState } from 'react'
import { schoolData } from '../Interfaces'
import styles from '../styles/rec.module.css'
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function Recommended() {


    const [schoolDataArr, setSchoolDataArr]: any[] = useState([])

    async function getSchoolArr(schoolSimiliar: any[]) {
        var tempArr: any[] = []
        for (const similarSchoolId of schoolSimiliar) {
            await getData("schools/" + similarSchoolId)
                .then((response) => {
                    const schooldata: schoolData = response.data;
                    tempArr.push(schooldata)
                })
                .catch((e) => { console.log(e) });
        }

        setSchoolDataArr(tempArr)
    }

    useEffect(() => {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries());

        getData("schools/" + params.id)
            .then((response) => {
                const schooldata: schoolData = response.data
                console.log("1", schooldata)

                if (schooldata.schoolSimiliar != []) {
                    getSchoolArr(schooldata.schoolSimiliar)
                }
            })
            .catch((e) => { console.log(e) });
    }, [])

    return (<>
        {schoolDataArr.length != 0 &&
            <div className={styles.cardContainer}>
                <span className={styles.title}>Lignende skoler</span>
                <div className={styles.content}>
                    {schoolDataArr.map((item: any, key: number) => {
                        return <div key={key} >
                            <Card sx={{ minWidth: 275, boxShadow: 10 }}>
                                <CardContent>
                                    <Typography variant="body2" sx={{ fontSize: 24 }} >
                                        {item.name}
                                    </Typography>
                                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                        {"ID: " + item.responsibility}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button style={{ border: "solid 1.5px" }}><a href="#" onClick={() => window.location.href = "/totalOversikt?id="+item.responsibility}>Se denne skolen</a></Button>
                                </CardActions>
                            </Card></div>
                    })}
                </div>
            </div>
        }
    </>)
}