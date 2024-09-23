import "@mantine/core/styles.css";

import "@mantine/carousel/styles.css";

import { MantineProvider } from "@mantine/core";

import Header from "./Components/Header";

import { Routes, Route } from "react-router-dom";

import Home from "./Pages/Home";

import About from "./Pages/About";

import Carousel_edit from "./Admin/Carousel_edit";

import Layout from "./Layout/Layout";

import Activate from "./Authentication/Activate";

import ResetPass from "./Authentication/ResetPass";

import ResetPassConfirm from "./Authentication/ResetPassConfirm";


export default function App() {
  return (
    <MantineProvider defaultColorScheme="false">
      
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Pages/About" element={<About />} />
            <Route path="/Admin/Carousel_edit" element={<Carousel_edit />} />
            <Route exact path="/activate/:uid/:token" element={<Activate />} />
            <Route exact path="/reset_password" element={<ResetPass />} />
            <Route
              exact
              path="/password/reset/confirm/:uid/:token"
              element={<ResetPassConfirm />}
            />
          </Routes>
        </Layout>
      
    </MantineProvider>
  );
}
