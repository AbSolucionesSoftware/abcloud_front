import React, { useEffect } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from '../../config/themeConfig';
import darkMode from '../../config/darkMode';
import { CssBaseline } from '@material-ui/core';
import PagoPaypalMovil from '../../pages/users/Compra_curso/paypalPayment/PaypalPaymentMovil';
import MantenimientoImg from "./Mantenimiento_img.png";
import mantenimiento from '../../context/context_mantenimiento';

export default function LayoutPagoMovil(props) {
	let thema = localStorage.getItem('tema');
	let tema = JSON.parse(thema);
	/* const [ darkTheme, setDarkTheme ] = useState(tema); */

	useEffect(
		() => {
			if (tema === null) {
				localStorage.setItem('tema', false);
				return;
			}
		},
		[ tema ]
	);

	if(mantenimiento){
		return (
			<div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", border: "1px black solid"}}>
				<div>
					<img style={{width: "700px"}} src={MantenimientoImg} />
					<p style={{fontSize: "40px", textAlign: "center"}}>Estamos haciendo cambios</p>
					<p style={{fontSize: "30px", textAlign: "center"}}>para brindarte una mejor experiencia.</p>
				</div>
			</div>
		)
	}

	return (
		<ThemeProvider theme={tema === true ? darkMode : theme}>
			<CssBaseline />
			<div>
                <PagoPaypalMovil />
			</div>
		</ThemeProvider>
	);
}