import React from 'react'

import { Box, Button, Container, Grid, makeStyles, Typography } from '@material-ui/core'

import imagen from '../../images/uniline3.png';

const useStyles = makeStyles((theme) => ({
	containerLogo:{ 
        maxHeight: 140,
        maxWidth: 260,
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center'
    },
    imagenDimension:{
        maxHeight: '100%',
        maxWidth: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center'
    },
    buttonInscripcion:{
        backgroundColor:'#EFB321',
        fontSize: 20
    },
    inputText:{
        maxWidth: '100%'
    },
    titulo:{
        fontSize: 30,
        fontWeight: 'bold'
    },
    informacion:{
        fontSize: 25
    }
}));

export default function AgradecimientoTaller(props) {

    const classes = useStyles();

    return (
        <Container>
            <Grid container justify="center" item lg={12} xs={12}>
                <Box p={3} textAlign="center" className={classes.containerLogo}>   
                    <img className={classes.imagenDimension} src={imagen} alt="Imagen de Ulinine" />
                </Box>
                
            </Grid>
            <Grid item lg={12} xs={12}>
                <Box textAlign="center" p={2}>
                    <Typography className={classes.titulo}>
                        Gracias por inscribirte a nuestro Taller
                    </Typography>
                </Box>
                <Box textAlign="center" p={2}>
                    <Typography className={classes.informacion}>
                        Enseguida te llegará una notificación al correo electrónico que nos proporcionaste. 
                    </Typography>
                    <Typography className={classes.informacion}>
                        En caso de no encontrarlo, revisar tu spam y agreganos a favoritos.
                    </Typography>
                    <Typography className={classes.informacion}>
                        Cualquier duda o aclaración escribenos al siguiente correo: soporte@cursosuniline.com
                    </Typography>
                </Box>
                <Box textAlign="center" p={2}> 
                    <Button
                        className={classes.buttonInscripcion}
                        onClick={() => props.history.push(`/`)}
                        size='large'
                        variant='contained'
                    >
                        Volver
                    </Button>
                </Box>
            </Grid>

        </Container>
    )
}
