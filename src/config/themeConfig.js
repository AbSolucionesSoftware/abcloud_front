import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
	palette: {
		type: 'light',
		navbar: '#4e00a0!important',
		navbarCategories: '#5900B6!important',
		abprimary: '#238CDF',
		absecondary: '#6A6969',
		abtertiary: '#b8b8b8',
		session: {
			main: '#E72F2F'
		},
		primary: {
			/* main: '#2196f3', */
			main: '#238CDF'
		},
		secondary: {
			main: '#6A6969'
		},
		error: {
			main: '#f44336'
		},
		warning: {
			main: '#ff9800'
		},
		info: {
			main: '#2196f3'
		},
		success: {
			main: '#5cb85c',
			secondary: '#c0ffb5'
		},
		text: {
			primary: 'rgba(0, 0, 0, 0.87)',
			secondary: 'rgba(0, 0, 0, 0.54)',
			disabled: 'rgba(0, 0, 0, 0.38)',
			hint: 'rgba(0, 0, 0, 0.38)'
		},
        divider: 'rgba(0, 0, 0, 0.12)',
		background: {
			paper: '#fff',
			default: '#fafafa',
			selected: '#f5f5f5',
		},
		action: {
			active: 'rgba(0, 0, 0, 0.54)',
			hover: 'rgba(0, 0, 0, 0.04)',
			hoverOpacity: 0.04,
			selected: 'rgba(0, 0, 0, 0.08)',
			selectedOpacity: 0.08,
			disabled: 'rgba(0, 0, 0, 0.26)',
			disabledBackground: 'rgba(0, 0, 0, 0.12)',
			disabledOpacity: 0.38,
			focus: 'rgba(0, 0, 0, 0.12)',
			focusOpacity: 0.12,
			activatedOpacity: 0.12
		}
	}
});

export default theme;
