import {  makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
	containerLogo:{ 
        maxHeight: 140,
        maxWidth: 260,
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center'
    },
    containerPromocional:{
        maxHeight: 500,
        maxWidth: 500,
        display: 'flex',
        alignItems: 'center',
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

    colorFondo:{
        backgroundColor: '#0b0b33',
    },
    titulo:{
        fontFamily: 'Bebas Neue, cursive',
        letterSpacing: 2,
        color:'white',
        fontSize: '35px',
        fontWeight: 'bold'
    },
    fecha:{
        fontWeight: 'bold',
        color:'#EFB321',
        fontFamily: 'Bebas Neue, cursive',
        letterSpacing: 2,
        fontSize: '28px'
    },
    datosDeInicio:{
        fontWeight: 'bold',
        color:'#EFB321',
        fontFamily: 'Poppins, sans-serif',
        fontSize: '20px'
    },
    descripcionBlanca:{
        fontFamily: 'Poppins, sans-serif',
        color:'white',
        fontSize: '18px'
    },
    divider:{
        backgroundColor: '#EFB321',
        borderTopWidth: 10
    },


    tituloSecundario:{
        fontFamily: 'Bebas Neue, cursive',
        letterSpacing: 2,
        color: '#EFB321',
        fontSize: '35px',
        fontWeight: 'bold'
    },
    tituloParcial:{
        fontFamily: 'Poppins, sans-serif',
        color: '#0b0b33',
        fontSize: '30px',
        fontWeight: 'bold'
    },
    descripcion:{
        fontFamily: 'Poppins, sans-serif',
        color:'#0b0b33',
        fontSize: '18px'
    },

    vinetas:{
        fontFamily: 'Poppins, sans-serif',
        fontSize: 35,
        color:'#EFB321',
    },
    descripcionVinetas:{
        fontFamily: 'Poppins, sans-serif',
        fontSize: 26,
        color:'#0b0b33',
    }
}));


export default useStyles;
