import { useContext } from "react";
import {
  ClientContext,
  UserContext,
  userQuery,
  onError,
} from "../../constants";
import cs from "./Login.module.css";
import { useMutation, useQueryCache } from "react-query";

const Login = () => {
  const user = useContext(UserContext);
  const client = useContext(ClientContext);
  const cache = useQueryCache();
  const [login, { isLoading: isLoadingLogin }] = useMutation(
    (name) => client.loginUser(name),
    {
      onMutate: (name) => {
        cache.cancelQueries(userQuery);
        const snapshot = cache.getQueryData(userQuery);
        cache.setQueryData(userQuery, name);
        return () => cache.setQueryData(userQuery, snapshot);
      },
      onError,
      onSettled: () => {
        cache.invalidateQueries(userQuery);
      },
    }
  );
  const onLogin = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    login(data.get("username"));
  };
  const [logout, { isLoading: isLoadingLogout }] = useMutation(
    () => client.logoutUser(),
    {
      onMutate: () => {
        cache.cancelQueries(userQuery);
        const snapshot = cache.getQueryData(userQuery);
        cache.setQueryData(userQuery, null);
        return () => cache.setQueryData(userQuery, snapshot);
      },
      onError,
      onSettled: () => {
        cache.invalidateQueries(userQuery);
      },
    }
  );
  const onLogout = async (e) => {
    e.preventDefault();
    logout();
  };
  const isPending = isLoadingLogin || isLoadingLogout;
  return (
    <section className={cs.content}>
      <h1>{user ? <>Hi, {user}</> : <>What's your name?</>}</h1>
      <form className={cs.form} onSubmit={onLogin}>
        <input
          required
          autoFocus
          disabled={isPending}
          type="text"
          placeholder="username"
          defaultValue={user || undefined}
          name="username"
        />
        {user ? (
          <input
            disabled={isPending}
            onClick={onLogout}
            type="button"
            value="logout"
          />
        ) : null}
        <input
          disabled={isPending}
          type="submit"
          value={user ? "change" : "login"}
        />
      </form>
    </section>
  );
};

export default Login;
