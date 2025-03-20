"use client";

import { Provider } from "react-redux";
import store, { persistStored } from "./store";
import { PersistGate } from "redux-persist/integration/react";

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistStored}> {children} </PersistGate>
    </Provider>
  );
}
