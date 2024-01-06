import { fade, makeStyles } from '@material-ui/core/styles';
import { deepOrange } from '@material-ui/core/colors';

/* estilos del nav de usuario */

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
	grow: {
		flexGrow: 1
	},
	appbar: {
		backgroundColor: theme.palette.navbar,
	},
	backgroundCategories: {
		backgroundColor: theme.palette.navbarCategories
	},
	marginButton: {
		margin: '0px 4px'
	},
	menuButton: {
		marginRight: theme.spacing(0)
	},
	search: {
		position: 'relative',
		display: 'flex',
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.white, 0.15),
		'&:hover': {
			backgroundColor: fade(theme.palette.common.white, 0.25)
		},
		marginLeft: 0,
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			marginLeft: theme.spacing(2),
			width: 'auto',
		},
		
	},
	searchIcon: {
		padding: theme.spacing(0, 2),
		height: '100%',
		position: 'absolute',
		pointerEvents: 'none',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	},
	inputRoot: {
		color: 'inherit'
	},
	inputInput: {
		padding: theme.spacing(1, 1, 1, 2),
		// vertical padding + font size from searchIcon
		/* paddingLeft: `calc(1em + ${theme.spacing(4)}px)`, */
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			width: '30ch',
			/* '&:focus': {
				width: '35ch'
			} */
		}
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0
	},
	drawerPaper: {
		width: drawerWidth
	},
	drawerHeader: {
		display: 'flex',
		alignItems: 'center',
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar,
		/* justifyContent: 'flex-end' */
	},
	offset: {
		minHeight: theme.spacing(6),
		[theme.breakpoints.up('md')]: {
			minHeight: theme.spacing(10),
		},
	},
	orange: {
		color: theme.palette.getContrastText(deepOrange[500]),
		backgroundColor: deepOrange[500]
	},
	logo: {
		display: 'none',
		height: 30,
		/* width: 150, */
		[theme.breakpoints.up('sm')]: {
			display: 'block'
		}
	},
	logoResponsive: {
		height: 40,
	},
	imagen: {
		height: '100%',
		width: "100%"
	},
	session: {
		backgroundColor: theme.palette.session.main,
		color: '#ffff'
	}
}));

export default useStyles;
