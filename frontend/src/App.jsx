import "@mantine/core/styles.css";

import '@mantine/carousel/styles.css';

import { MantineProvider } from "@mantine/core";

import Header from "./Components/Header";

import { Routes, Route,  BrowserRouter as Router } from "react-router-dom";

import Home from "./Pages/Home";

import About from "./Pages/About";

import Carousel_edit from "./Admin/Carousel_edit";

import Login from "./Components/Login";

import SocialLogin from "./Components/SocialLogin";

import { AuthProvider } from "./AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <MantineProvider defaultColorScheme="false">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Pages/About" element={<About />} />
        <Route path="/Admin/Carousel_edit" element={<Carousel_edit />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </MantineProvider>
    </AuthProvider>
  );
}
