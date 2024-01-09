import { createMuiTheme } from '@material-ui/core/styles';

const darkMode = createMuiTheme({
	palette: {
		type: 'dark',
		navbar: '#141f34!important',
		navbarCategories: '#252d3c!important',
		abprimary: '#238CDF',
		absecondary: '#6A6969',
		abtertiary: '#b8b8b8',
		session: {
			main: '#E72F2F'
		},
		primary: {
			main: '#A7D0EF'
		},
		secondary: {
			main: '#C8C8C8'
		},
		background: {
			paper: '#252d3c',
			default: '#141f34',
			selected: '#141f34'
		},
	}
});

export default darkMode;
