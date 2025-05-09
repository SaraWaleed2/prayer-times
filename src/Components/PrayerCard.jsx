import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';

export default function PrayerCard({prayerName , img ,timings}) {
    return (
        <Grid size={2.4}>
            <Card sx={{ maxWidth: 345 ,backgroundColor: 'rgba(255, 255, 255, 0.63)'}} dir='rtl'>
                    <CardMedia
                        component="img"
                        height="140"
                        image={img}
                        alt="green iguana"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" style={{fontWeight:"600"}}>
                            {prayerName}
                        </Typography>
                        <Typography variant="subtitle2" fontSize={"40px"}>
                            {timings}
                        </Typography>
                    </CardContent>
            </Card>
        </Grid>
    )
}
