//layout
import LayoutMaestro from "../components/Layout_Maestro/layout_maestro";
import LayoutContenidoCurso from "../components/Layout_Maestro/layout_contenido";
import LayoutUsers from "../components/Layout_User/layout_usuario";
import LayoutDashboardUser from "../components/Layout_User/layout_dashboar";
import RecuperarPassword from "../components/Layout_User/layout_recovery";
import PagarCurso from "../components/Layout_User/layout_pago";
/* import LayoutPagoMovil from '../components/Layout_User/layout_pago_movil'; */

//Admin pages
//import DashboardMaestro from "../pages/maestro/Dashboard_maestro/dashboard";
import SubirCursoMaestro from "../pages/maestro/Subir_curso/CrearCurso/crear_curso";
import EstadisticasMaestro from "../pages/maestro/Estadisticas/estadisticas";
import Categorias from "../pages/maestro/Categorias/Categorias";
import RegistroUsuariosUniline from "../pages/maestro/RegistroUsuarios/TabPanelUsuarios";
import RegistroBannersCarousel from "../pages/maestro/Banner/Banner";
import NotificacionesAdmin from "../pages/maestro/Notificaciones/NotificacionesAdmin";
import PackagesCourses from "../pages/maestro/PackagesCourses/PackagesIndex";
import RegistroDeErrores from "../pages/maestro/RegistroErrores/RegistroErrores";
import VentasMaestro from "../pages/maestro/Ventas/Ventas";
import HomeDesign from "../pages/maestro/HomeDesign/HomeDesign";

import TallerPage from "../pages/taller/taller_page";
import AgradecimientoTaller from "../pages/taller/agradecimiento_taller";
import Questions from "../pages/users/QuestionCourse/Questions";
import RespuestasEncuestaUniline from "../pages/maestro/RespuestasEncuentaUniline/RespuestasEncuestaUniline";
/* import VistaAprendizajes from '../pages/maestro/Subir_curso/Dasboard_curso/Taller_curso/Aprendizajes/vista_aprendizajes'; */

//dashboard registro curso pages
import RegistroInformacionCurso from "../pages/maestro/Subir_curso/Dasboard_curso/Info_general/informacion_curso";
import QueAprenderaEstudiante from "../pages/maestro/Subir_curso/Dasboard_curso/Info_general/Learnings/vista_learnings";
import RegistroContenido from "../pages/maestro/Subir_curso/Dasboard_curso/Contenido_curso/contenido";
import PrecioCurso from "../pages/maestro/Subir_curso/Dasboard_curso/Publicacion_curso/precio";
import TareasEstudiantes from "../pages/maestro/Subir_curso/Tareas/tareas";
import EstudiantesCurso from "../pages/maestro/Subir_curso/Estudiantes/estudiantes";
import RegistroTaller from "../pages/maestro/Subir_curso/Dasboard_curso/Taller_curso/registro_taller";
/* import AlumnosRegistrados from '../pages/maestro/Subir_curso/Dasboard_curso/Taller_curso/Usuarios/alumnos_registrados'; */
import NotificacionesCurso from "../pages/maestro/Subir_curso/Dasboard_curso/NotificacionesCurso/Notifications";

//Users pages
import Home from "../pages/users/Home/home";
import BuscarCertificado from "../pages/users/BuscarCertificado/CertificadoIndex";
import ResultadoBusqueda from "../pages/users/Busqueda/resultados_busqueda";
import ResultadoBusquedaCategorias from "../pages/users/BusquedaCategorias/ResultadosCategorias";
import Carrito from "../pages/users/Carrito/carrito";
import MisCursos from "../pages/users/Cursos_usuario/mis_cursos";
import GenerarCertificado from "../pages/users/Dashboard_Usuario/certificado";
import PerfilUsuario from "../pages/users/Perfil_usuario/perfil";
import Politicas from "../pages/users/Politicas/politicas";
import ImagenCorporativa from "../pages/users/Imagen_corporativa/imagen_corporativa";
import LoginUsuario from "../pages/users/Login/login";
import RegistroUsuario from "../pages/users/Registro/registro";
import VistaCurso from "../pages/users/Vista_curso";
import PagoSuccess from "../pages/users/Compra_curso/success_page";
import PagoFailed from "../pages/users/Compra_curso/failed_page";
import VimeoReactNative from "../pages/users/Dashboard_Usuario/vimeo_react_native";
import OnChangeVista from "../pages/users/Dashboard_Usuario/vista_change";
import VistaPaquete from "../pages/users/Paquetes/VistaPaquete/VistaPaquete";

//other
import Error404 from "../pages/error404";
import PreguntasUniline from "../pages/maestro/PreguntasUniline/PreguntasUniline";
import StripeConfirm from "../pages/users/Compra_curso/stripeConfirm";
import Productos from "../pages/maestro/Productos";
import Consultoria from "../pages/users/Consultoria";
import DashboardPrincipal from "../pages/maestro/Dashboard_maestro";
import LinksPago from "../pages/maestro/LinksPago";
import AppsPage from "../pages/users/Apps";
import PaymentLinkFailed from "../pages/maestro/LinksPago/PaymentFailed";
import PaymentLinkSuccess from "../pages/maestro/LinksPago/PaymentSuccess";

const routes = [
  {
    path: "/instructor/nuevo_curso",
    component: SubirCursoMaestro,
    exact: true,
  },
  {
    path: "/dashboard/:url",
    component: LayoutDashboardUser,
    exact: true,
  },
  {
    path: "/certificado/:url",
    component: GenerarCertificado,
    exact: true,
  },
  {
    path: "/compra",
    component: PagarCurso,
    exact: true,
  },
  {
    path: "/vimeo_mobil/:url/:info",
    component: VimeoReactNative,
    exact: true,
  },
  {
    path: "/vimeo_mobil_change/:action",
    component: OnChangeVista,
    exact: true,
  },
  {
    path: "/curso_taller/:slug",
    component: TallerPage,
    exact: true,
  },
  {
    path: "/register_user/inscrito",
    component: AgradecimientoTaller,
    exact: true,
  },
  /* 	{
		path: '/compra_movil/:amount',
		component: LayoutPagoMovil,
		exact: true
	}, */
  {
    path: "/reset_password/:url",
    component: RecuperarPassword,
    exact: true,
  },
  {
    path: "/question-curse-uniline/:idCurso/curso/:slug",
    component: Questions,
    exact: true,
  },
  {
    path: "/instructor/contenido_curso/:curso",
    component: LayoutContenidoCurso,
    exact: false,
    routes: [
      {
        path: "/instructor/contenido_curso/:curso/general",
        component: RegistroInformacionCurso,
        exact: true,
      },
      {
        path: "/instructor/contenido_curso/:curso/learn",
        component: QueAprenderaEstudiante,
        exact: true,
      },
      {
        path: "/instructor/contenido_curso/:curso/contenido",
        component: RegistroContenido,
        exact: true,
      },
      {
        path: "/instructor/contenido_curso/:curso/precio",
        component: PrecioCurso,
        exact: true,
      },
      {
        path: "/instructor/contenido_curso/:curso/tareas",
        component: TareasEstudiantes,
        exact: true,
      },
      {
        path: "/instructor/contenido_curso/:curso/estudiantes",
        component: EstudiantesCurso,
        exact: true,
      },
      {
        path: "/instructor/contenido_curso/:curso/taller",
        component: RegistroTaller,
        exact: true,
      },
      {
        path: "/instructor/contenido_curso/:curso/notificaciones",
        component: NotificacionesCurso,
        exact: true,
      },
      /* {
				path: '/instructor/contenido_curso/:curso/taller_aprendizajes',
				component: VistaAprendizajes,
				exact: true,
			}, */
      /* {
				path: '/instructor/contenido_curso/:curso/alumnostaller',
				component: AlumnosRegistrados,
				exact: true,
			}, */
      {
        component: Error404,
      },
    ],
  },
  {
    path: "/instructor",
    component: LayoutMaestro,
    exact: false,
    routes: [
      {
        path: "/instructor/cursos",
        component: DashboardPrincipal,
        exact: true,
      },
      {
        path: "/instructor/paymentlinks",
        component: LinksPago,
        exact: true,
      },
      {
        path: "/instructor/estadisticas",
        component: EstadisticasMaestro,
        exact: true,
      },
      {
        path: "/instructor/categorias",
        component: Categorias,
        exact: true,
      },
      {
        path: "/instructor/registro_usuarios",
        component: RegistroUsuariosUniline,
        exact: true,
      },
      {
        path: "/instructor/banner",
        component: RegistroBannersCarousel,
        exact: true,
      },
      {
        path: "/instructor/notificaciones",
        component: NotificacionesAdmin,
        exact: true,
      },
      {
        path: "/instructor/paquetes",
        component: PackagesCourses,
        exact: true,
      },
      {
        path: "/instructor/ventas",
        component: VentasMaestro,
        exact: true,
      },
      {
        path: "/instructor/homedesign",
        component: HomeDesign,
        exact: true,
      },
      {
        path: "/instructor/registro-errores",
        component: RegistroDeErrores,
        exact: true,
      },
      {
        path: "/instructor/preguntas-uniline",
        component: PreguntasUniline,
        exact: true,
      },
      {
        path: "/instructor/respuestas-encuenta",
        component: RespuestasEncuestaUniline,
        exact: true,
      },
      {
        path: "/instructor/productos",
        component: Productos,
        exact: true,
      },
      {
        component: Error404,
      },
    ],
  },
  {
    path: "/",
    component: LayoutUsers,
    exact: false,
    routes: [
      {
        path: "/",
        component: Home,
        exact: true,
      },
      {
        path: "/buscar-certificado",
        component: BuscarCertificado,
        exact: true,
      },
      {
        path: "/busqueda/:url",
        component: ResultadoBusqueda,
        exact: true,
      },
      {
        path: "/search",
        component: ResultadoBusquedaCategorias,
        exact: true,
      },
      {
        path: "/carrito",
        component: Carrito,
        exact: true,
      },
      {
        path: "/mis_cursos",
        component: MisCursos,
        exact: true,
      },
      {
        path: "/perfil",
        component: PerfilUsuario,
        exact: true,
      },
      {
        path: "/politicas",
        component: Politicas,
        exact: true,
      },
      {
        path: "/imagen_corporativa",
        component: ImagenCorporativa,
        exact: true,
      },
      {
        path: "/login",
        component: LoginUsuario,
        exact: true,
      },
      {
        path: "/registro",
        component: RegistroUsuario,
        exact: true,
      },
      {
        path: "/curso/:url",
        component: VistaCurso,
        exact: true,
      },
      {
        path: "/paquete/:url",
        component: VistaPaquete,
        exact: true,
      },
      {
        path: "/payment_success/:idPago",
        component: PagoSuccess,
        exact: true,
      },
      {
        path: "/payment_failed/:idPago/:message",
        component: PagoFailed,
        exact: true,
      },
      {
        path: "/payment_confirm",
        component: StripeConfirm,
        exact: true,
      },
      {
        path: "/consultoria",
        component: Consultoria,
        exact: true,
      },
      {
        path: "/apps",
        component: AppsPage,
        exact: true,
      },
      {
        path: "/paymentlink/success/:idPaymentLink",
        component: PaymentLinkSuccess,
        exact: true,
      },
      {
        path: "/paymentlink/failed/:idPaymentLink",
        component: PaymentLinkFailed,
        exact: true,
      },
      {
        component: Error404,
      },
    ],
  },
];

export default routes;
