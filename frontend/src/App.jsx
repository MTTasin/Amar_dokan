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

import LoginForm from "./Pages/LoginForm";

import RegisterForm from "./Pages/RegisterForm";

import ResetPassConfirm from "./Authentication/ResetPassConfirm";

import Dashboard from "./Pages/Dashboard";

import { Provider } from "react-redux";

import { store } from "./features/auth/store";

import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <MantineProvider defaultColorScheme="false">
      <Provider store={store}>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/About" element={<About />} />
            <Route path="/Carousel_edit" element={<Carousel_edit />} />
            <Route exact path="/activate/:uid/:token" element={<Activate />} />
            <Route exact path="/reset_password" element={<ResetPass />} />
            <Route exact path="/login" element={<LoginForm />} />
            <Route exact path="/signup" element={<RegisterForm />} />
            <Route exact path="/dashboard" element={<Dashboard />} />
            <Route
              exact
              path="/password/reset/confirm/:uid/:token"
              element={<ResetPassConfirm />}
            />
          </Routes>
          <ToastContainer />
        </Layout>
      </Provider>
    </MantineProvider>
  );
}
