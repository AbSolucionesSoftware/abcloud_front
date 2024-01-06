import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import routes from "./config/routes";
import { Helmet } from "react-helmet";
import "./styles.scss";
import ConexionDetect from "./ConexionDetect";
import { obtenerTokenFCM } from "./components/Firebase/firebaseInit";
import { CtxPrincipalProvider } from "./context/ContextPrincipal";

function App() {
  useEffect(() => {
    obtenerTokenFCM();
  }, []);

  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>UNILINE</title>
      </Helmet>
      <CtxPrincipalProvider>
        <ConexionDetect />
        <Router>
          <Switch>
            {routes.map((route, index) => (
              <RoutesWithSubRoutes key={index} {...route} />
            ))}
          </Switch>
        </Router>
      </CtxPrincipalProvider>
    </div>
  );
}

function RoutesWithSubRoutes(route) {
  return (
    <Route
      path={route.path}
      exact={route.exact}
      render={(props) => <route.component routes={route.routes} {...props} />}
    />
  );
}

export default App;
