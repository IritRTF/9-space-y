import {
  useQuery,
  QueryCache,
  ReactQueryCacheProvider,
  ReactQueryErrorResetBoundary,
} from "react-query";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense, useContext } from "react";
import Loading from "./components/Loading";
import Layout from "./components/Layout";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ClientContext, UserContext, userQuery } from "./constants";
import { LoginPage, loginPath } from "./pages/Login";
import { AboutPage, aboutPath } from "./pages/About";
import { HistoryPage, historyPath } from "./pages/History";
import { HistoryEventPage, historyEventPath } from "./pages/HistoryEvent";
import { RocketsPage, rocketsPath } from "./pages/Rockets";
import { RocketPage, rocketPath } from "./pages/Rocket";
import { RoadsterPage, roadsterPath } from "./pages/Roadster";
import { SendToMarsPage, sendToMarsPath } from "./pages/SendToMars";

const queryCache = new QueryCache({
  defaultConfig: {
    queries: {
      suspense: true,
      retry: 0,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});

const App = ({ client }) => (
  <ClientContext.Provider value={client}>
    <ReactQueryCacheProvider queryCache={queryCache}>
      <Router>
        <Suspense fallback={<Loading />}>
          <UserProvider>
            <Layout>
              <ReactQueryErrorResetBoundary>
                {({ reset }) => (
                  <ErrorBoundary
                    onReset={reset}
                    fallbackRender={FallbackRender}
                  >
                    <Suspense fallback={<Loading />}>
                      <Routing />
                    </Suspense>
                  </ErrorBoundary>
                )}
              </ReactQueryErrorResetBoundary>
            </Layout>
          </UserProvider>
        </Suspense>
      </Router>
    </ReactQueryCacheProvider>
  </ClientContext.Provider>
);

const UserProvider = ({ children }) => {
  const client = useContext(ClientContext);
  const { data: user } = useQuery(userQuery, async () => {
    try {
      return await client.getUser();
    } catch (err) {
      console.error(err);
      return null;
    }
  });
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

const Routing = () => {
  const user = useContext(UserContext);
  return (
    <Switch>
      <Route path={loginPath}>
        <LoginPage />
      </Route>
      {user ? (
        <Switch>
          <Route path={aboutPath}>
            <AboutPage />
          </Route>
          <Route exact path={historyPath}>
            <HistoryPage />
          </Route>
          <Route path={historyEventPath}>
            <HistoryEventPage />
          </Route>
          <Route exact path={rocketsPath}>
            <RocketsPage />
          </Route>
          <Route path={rocketPath}>
            <RocketPage />
          </Route>
          <Route path={roadsterPath}>
            <RoadsterPage />
          </Route>
          <Route path={sendToMarsPath}>
            <SendToMarsPage />
          </Route>
        </Switch>
      ) : null}
      <Route path="*">
        <NotFound />
      </Route>
    </Switch>
  );
};

const NotFound = () => <h1>Sorry, nothing here</h1>;

const FallbackRender = ({ resetErrorBoundary, error }) => (
  <div>
    <h1>Oops, there was an error!</h1>
    <pre>{error.message}</pre>
    <button onClick={() => resetErrorBoundary()}>Try again</button>
  </div>
);

export default App;
