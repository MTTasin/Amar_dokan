import "@mantine/core/styles.css";

import '@mantine/carousel/styles.css';

import { MantineProvider } from "@mantine/core";

import Header from "./Components/Header";

import { Routes, Route } from "react-router-dom";

import Home from "./Pages/Home";

import About from "./Pages/About";

import Carousel_edit from "./Admin/Carousel_edit";

export default function App() {
  return (
    <MantineProvider defaultColorScheme="false">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Pages/About" element={<About />} />
        <Route path="/Admin/Carousel_edit" element={<Carousel_edit />} />
      </Routes>
    </MantineProvider>
  );
}
