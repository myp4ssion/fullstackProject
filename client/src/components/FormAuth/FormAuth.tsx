import { FC, FormEvent, useEffect, useRef, useState } from "react";
import classes from "./FormAuth.module.scss";
import fonts from "@/scss/fonts.module.scss";
import { login } from "@/http/userAPI";

const FormAuth: FC<{ setAuth: (value: boolean) => void }> = ({ setAuth }) => {
  const inputLoginRef = useRef(null);
  const inputPasswordRef = useRef(null);
  const formButtonRef = useRef(null);

  const [logIn, setLogIn] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    inputLoginRef.current.disabled = isPending;
    inputPasswordRef.current.disabled = isPending;
    formButtonRef.current.disabled = isPending;
  }, [isPending]);

  const handleSubmit = async (e: FormEvent) => {
    try {
      let user;
      setError("");
      setIsPending(true);
      e.preventDefault();
      user = await login(logIn, password);
      setAuth(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsPending(false);
    }
  };
  return (
    <main className={classes.main}>
      <form onSubmit={handleSubmit} className={classes.authForm}>
        <input
          className={`${classes.formInput} ${fonts.g300}`}
          placeholder="Логин"
          name="login"
          value={logIn}
          onChange={(e) => setLogIn(e.target.value)}
          ref={inputLoginRef}
        />
        <input
          className={`${classes.formInput} ${fonts.g300}`}
          placeholder="Пароль"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          ref={inputPasswordRef}
        />
        <button
          ref={formButtonRef}
          className={`${classes.formButton} ${fonts.u500}`}
        >
          Войти
        </button>
        {error && (
          <span style={{ color: "red" }} className={fonts.g300}>
            {error}
          </span>
        )}
      </form>
    </main>
  );
};

export default FormAuth;
