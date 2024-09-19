import { GoogleOAuthProvider } from "@react-oauth/google";

import "@mantine/core/styles.css";

import "@mantine/carousel/styles.css";

import { MantineProvider } from "@mantine/core";

import Header from "./Components/Header";

import { Routes, Route, BrowserRouter as Router } from "react-router-dom";

import Home from "./Pages/Home";

import About from "./Pages/About";

import Carousel_edit from "./Admin/Carousel_edit";

export default function App() {
  return (
    <GoogleOAuthProvider clientId="315032638891-hvdp7vfb45gv7ln8j3clc7bmnpid8usj.apps.googleusercontent.com">
      <MantineProvider defaultColorScheme="false">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Pages/About" element={<About />} />
          <Route path="/Admin/Carousel_edit" element={<Carousel_edit />} />
        </Routes>
      </MantineProvider>
    </GoogleOAuthProvider>
  );
}
