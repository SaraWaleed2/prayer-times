import { Container, Grid, Typography, useTheme } from "@mui/material";
import PrayerCard from "./PrayerCard";
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import axios from "axios";
import { useEffect, useState } from "react";
import useMediaQuery from '@mui/material/useMediaQuery';
import moment from 'moment';
import 'moment/dist/locale/ar-ly'
moment.locale('ar');



const availableCitites = [
    {
        name: 'القاهره',
        value: 'cairo',
    },
    {
        name: 'الجيزه',
        value: 'giza',
    },
    {
        name: 'الاسكندريه',
        value: 'alexandria',
    },
    {
        name: 'المنصوره',
        value: 'mansoura',
    },
    {
        name: 'الزقازيق',
        value: 'zagazig',
    },
];

export default function Prayer() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [timing, setTiming] = useState({
        Fajr: "00:00",
        Dhuhr: "00:00",
        Asr: "00:00",
        Sunset: "00:00",
        Isha: "00:00",
    });
    const [city, setCity] = useState({
        value: "cairo",
        name: "القاهره"
    });

    const [dateAndTime, setDateAndTime] = useState('');

    const [nextPrayerIndex, setNextPrayerIndex] = useState(2);

    const [remainingTime, setRemainingTime] = useState("");

    const prayerCards = [
        { displayName: "الفجر", img: "https://i.pinimg.com/736x/51/60/5d/51605daa495d8b592fa5ea61f64d9066.jpg", timings: timing.Fajr },
        { displayName: "الظهر", img: "https://i.pinimg.com/736x/7c/7a/a3/7c7aa359ff8e020e93ef5c785110e1b5.jpg ", timings: timing.Dhuhr },
        { displayName: "العصر", img: "https://i.pinimg.com/736x/8e/de/b4/8edeb4eb4ac3d6a58b6f325136847afd.jpg", timings: timing.Asr },
        { displayName: "المغرب", img: "https://i.pinimg.com/736x/e4/aa/b0/e4aab02613784a6d5b873748c1427a91.jpg", timings: timing.Sunset },
        { displayName: "العشاء", img: "https://i.pinimg.com/736x/1b/66/2b/1b662b79abc6e50251d6c441205451cb.jpg", timings: timing.Isha },
    ];

    const prayersArray = [
        { key: "Fajr", displayName: "الفجر" },
        { key: "Dhuhr", displayName: "الظهر" },
        { key: "Asr", displayName: "العصر" },
        { key: "Sunset", displayName: "المغرب" },
        { key: "Isha", displayName: "العشاء" },
    ];


    function handleSelectedCity(e) {
        const selectedCity = availableCitites.find((city) => {
            return city.value == e.target.value
        }
        )
        setCity(selectedCity);
    }


    useEffect(() => {
        axios.get(`https://api.aladhan.com/v1/timingsByCity?city=${city.value}&country=eg`)
            .then((response) => {
                console.log(response.data.data.timings);
                setTiming(response.data.data.timings);
                console.log(city)
            })
            .catch((error) => {
                console.error('Error fetching prayer times:', error);
            });
    }, [city]);

    useEffect(() => {
        const times = setInterval(() => {
            handleCountDownTimer();
        }, 1000)

        setDateAndTime(moment().format('MMMM Do YYYY |  h:mm a'))

        return () => {
            clearInterval(times)
        }
    }, [timing])



    function handleCountDownTimer() {
        const momentNow = moment();
        let prayerIndex = 2;

        if (momentNow.isAfter(moment(timing["Fajr"], 'h:mm')) && momentNow.isBefore(moment(timing["Dhuhr"], 'h:mm'))) {
            console.log("Dhuhr")
            prayerIndex = 1;
        }
        else if (momentNow.isAfter(moment(timing["Dhuhr"], 'h:mm')) && momentNow.isBefore(moment(timing["Asr"], 'h:mm'))) {

            console.log("Asr");
            prayerIndex = 2;
        }
        else if (momentNow.isAfter(moment(timing["Asr"], 'h:mm')) && momentNow.isBefore(moment(timing["Sunset"], 'h:mm'))) {
            console.log("Sunset");
            prayerIndex = 3;
        }
        else if (momentNow.isAfter(moment(timing["Sunset"], 'h:mm')) && momentNow.isBefore(moment(timing["Isha"], 'h:mm'))) {
            console.log("Isha");
            prayerIndex = 4;
        }
        else {
            console.log("Fajr");
            prayerIndex = 0;
        }
        setNextPrayerIndex(prayerIndex);

        // const nextPrayerObject = prayersArray[prayerIndex];
        const nextPrayerTime = timing[prayersArray[prayerIndex].key];
        const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");

        let remainingTime = moment(nextPrayerTime, "hh:mm").diff(momentNow);

        if (remainingTime < 0) {
            const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow);
            const fajrToMidnightDiff = nextPrayerTimeMoment.diff(
                moment("00:00:00", "hh:mm:ss")
            );

            const totalDiffernce = midnightDiff + fajrToMidnightDiff;

            remainingTime = totalDiffernce;
        }
        console.log(remainingTime);


        setRemainingTime(
            ` ${moment.duration(remainingTime).hours()} : ${moment.duration(remainingTime).seconds()} :  ${moment.duration(remainingTime).minutes()} `
        );
        console.log(
            "duration: ",
            moment.duration(remainingTime).hours(),
            moment.duration(remainingTime).minutes(),
            moment.duration(remainingTime).seconds()
        );
    }



    return (
        <div className="prayer-body" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: isMobile ? "100%" : "100vh" }}>
            <Container maxWidth="lg">
                <div style={{ backgroundColor: " #ffffff4e", padding: "25px", borderRadius: "20px" }}>
                    <div className="city-info" style={{ marginBottom: "20px" }}>
                        <Grid container >

                            <Grid size={6}>
                                <div className="city-date" style={{ textAlign: "right" }}>
                                    <Typography variant="subtitle2" color="text.secondary" style={{ fontSize: isMobile ? "15px" : "17px", fontWeight: "700" }}>
                                        متبقى حتى الصلاه {prayersArray[nextPrayerIndex].displayName}
                                    </Typography>
                                    <Typography variant={isMobile ? "h6" : 'h3'} style={{ color: "rgb(255, 255, 255) ", fontWeight: "700" }}>
                                        {remainingTime}
                                    </Typography>

                                </div>
                            </Grid>

                            <Grid size={6}>
                                <div className="city-date" style={{ textAlign: "right" }}>
                                    <Typography variant="subtitle2" color="text.secondary" style={{ fontSize: isMobile ? "15px" : "17px", fontWeight: "700" }}>
                                        {dateAndTime}
                                    </Typography>
                                    <Typography variant={isMobile ? "h6" : 'h3'} style={{ color: "rgb(255, 255, 255)", fontWeight: "700" }}>
                                        {city.name}
                                    </Typography>

                                </div>
                            </Grid>

                        </Grid>
                    </div>
                    <div className="prayer-times" dir="rtl">
                        <Grid container spacing={1}>
                            {
                                prayerCards.map((prayer, i) => (
                                    <PrayerCard key={i} prayerName={prayer.displayName} img={prayer.img} timings={prayer.timings} />
                                ))

                            }

                        </Grid>
                    </div>
                </div>
                <div className="selection" style={{ display: "flex", alignItems: "center", justifyContent: "center" }} dir="rtl">
                    <TextField
                        value={city.value}
                        onChange={handleSelectedCity}
                        id="outlined-select-currency"
                        select
                        label="اختر المدينه"
                        sx={{
                            width: 200,
                            marginTop: "20px",
                            borderRadius: "10px",
                        }}
                    >
                        {availableCitites.map((option) => (
                            <MenuItem key={option.value} value={option.value} >
                                {option.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </div>
            </Container>
        </div>
    )
}
