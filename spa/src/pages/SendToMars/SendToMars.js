import React, { useContext } from "react";
import { useMutation, useQuery, useQueryCache } from "react-query";
import { ClientContext, onError, sentToMarsQuery } from "../../constants";
import cs from "./SendToMars.module.css";

const pick = (data, keys) =>
  Object.fromEntries(keys.map((key) => [key, data.get(key)]));

const SendToMars = () => {
  const client = useContext(ClientContext);
  const { data: items } = useQuery(sentToMarsQuery, () =>
    client.getSentToMars()
  );
  const cache = useQueryCache();
  const [send, { isLoadingSend }] = useMutation(
    (item) => client.sendToMars(item),
    {
      onMutate: (item) => {
        cache.cancelQueries(sentToMarsQuery);
        const snapshot = cache.getQueryData(sentToMarsQuery);
        cache.setQueryData(sentToMarsQuery, (prev) => [
          ...prev,
          { ...item, id: Math.random() },
        ]);
        return () => cache.setQueryData(sentToMarsQuery, snapshot);
      },
      onError,
      onSettled: () => {
        cache.invalidateQueries(sentToMarsQuery);
      },
    }
  );
  const onSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    send(pick(data, ["name", "phone", "weight", "color", "important"]));
  };
  const [cancel, { isLoading: isLoadingCancel }] = useMutation(
    (item) => client.cancelSendingToMars(item),
    {
      onMutate: (item) => {
        cache.cancelQueries(sentToMarsQuery);
        const snapshot = cache.getQueryData(sentToMarsQuery);
        cache.setQueryData(sentToMarsQuery, (prev) =>
          prev.filter((x) => x.id !== item.id)
        );
        return () => cache.setQueryData(sentToMarsQuery, snapshot);
      },
      onError,
      onSettled: () => {
        cache.invalidateQueries(sentToMarsQuery);
      },
    }
  );
  const isPending = isLoadingSend || isLoadingCancel;
  return (
    <section className={cs.content}>
      <h1>Send to Mars</h1>
      <section>
        <form onSubmit={onSubmit}>
          <fieldset disabled={isPending} className={cs.form}>
            <label>
              Name <input required type="text" name="name" />
            </label>
            <label>
              Phone <input required type="tel" name="phone" />
            </label>
            <label>
              Weight <input type="number" name="weight" />
            </label>
            <label>
              Color <input type="color" name="color" defaultValue="#ffffff" />
            </label>
            <label>
              Important <input type="checkbox" name="important" />
            </label>
            <label>
              Done? <input type="submit" value="send" />
            </label>
          </fieldset>
        </form>
      </section>
      <section>
        {items.length > 0 ? (
          <>
            <h2>Waiting for launch date</h2>
            <ul className={cs.items}>
              {items.map((item) => {
                const onClick = () => {
                  cancel(item);
                };
                console.log(item);
                return (
                  <li key={item.id} style={{ color: item.color }}>
                    {item.name}
                    {item.important ? " (!) " : " "}
                    <button onClick={onClick}>X</button>
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <h2>Queue is empty</h2>
        )}
      </section>
    </section>
  );
};

export default SendToMars;
