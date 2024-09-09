import "@mantine/core/styles.css";

import { MantineProvider, ColorSchemeScript } from "@mantine/core";

import Header from "./Components/Header";

export default function App() {
  return (
    <MantineProvider>
      <Header />
    </MantineProvider>
  );
}
