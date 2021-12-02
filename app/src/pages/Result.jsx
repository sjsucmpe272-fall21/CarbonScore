import React, {useEffect, useState} from 'react'
import { useLocation } from 'react-router';
import { AwesomeButton } from 'react-awesome-button';
import { backgroundStyle } from './Landing'
import {useNavigate} from 'react-router-dom';

export default function Result({
    process, 
    year,
    selectCounty,
    selectState,
}) {
    let location = useLocation();
    const { data } = location.state;
    const navigate = useNavigate();
    const [score, setScore] = useState(810)
    const [tax, setTax] = useState(20000.00)
    const handleGetData = () => {
        // Call backend to get results and pass as param
        navigate('../dashboard', { state: {result:"abc"}, replace: false })
    }

    const locationInfo = ((selectCounty != null) ? selectCounty + ', ' : '') + ((selectState != null) ? selectState : '')
    const headerInfo = year != null ? 
        ((process === 'Predict' ? 'Predicted Carbon Score for the year ' + year.toString() : 'Existing Carbon Score for the year ' + year.toString()) + ' in ' + locationInfo) 
        : 'Carbon Score'

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        
        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
        });

    useEffect(() => {
        if (process == null) {
            navigate('../', { state: {result:"abc"}, replace: false }) 
        }

        const predictCOPollScore = "http://carbon-score-v2.us-west-1.elasticbeanstalk.com/predict_CO_score" +
            (selectState != null && selectState != '' ? `?state=${selectState}` : '') + 
            (selectCounty != null && selectCounty != '' ? `&county=${selectCounty}` : '') + 
            (year != null && year != '' ? `&year=${year}` : '')
        const existingCOScoreCounty = "http://carbon-score.us-west-1.elasticbeanstalk.com/existing_CO_score_county" +
            (selectCounty != null && selectCounty != '' ? `?county=${selectCounty}` : '') + 
            (year != null && year != '' ? `&year=${year}` : '')
        fetch(process === 'Predict' ? predictCOPollScore : existingCOScoreCounty)
        .then(response => {
          response.json().then(data => {
            if (process === 'Existing') {
                setScore(data * 1000)
            } else {
                setScore(data['carbonscore'] * 1000)
                setTax(formatter.format(data['tax']))
            }
          })
        })
        .catch(err => console.log(err))

        if (process === 'Existing') {
            const existingCOTaxCounty = "http://carbon-score.us-west-1.elasticbeanstalk.com/existing_CO_tax_county" +
                (selectCounty != null && selectCounty != '' ? `?county=${selectCounty}` : '') + 
                (year != null && year != '' ? `&year=${year}` : '')
            fetch(existingCOTaxCounty)
                .then(response => {
                    response.json().then(data => {
                        setTax(formatter.format(data))
                    })
                })
                .catch(err => console.log(err))
            }
    }, [])


    return (
        <div style={backgroundStyle}>
            <header>
                <p>
                    {headerInfo}
                </p>
                <h1>
                    {score}
                </h1>
            </header>
            <div>
                <h2>{tax}</h2>
            </div>
            <br />
            <AwesomeButton onPress={handleGetData}>Dashboard</AwesomeButton>
        </div>
    )
}
