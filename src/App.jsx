import React from "react";
import LandingPage from "./components/LandingPage";
import { Register } from "./Pages/Auth/Signup";
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from "@apollo/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { SignIn } from "./Pages/Auth/Signin";
import Default from "./Pages/Dash/Home";
import Authenticated from "./Pages/Auth/Authenticted";
import { setContext } from "apollo-link-context";
import { Setup } from "./Pages/Auth/Setup/Setup";
import { Setup2 } from "./Pages/Auth/Setup/Setup2";
import { Setup3 } from "./Pages/Auth/Setup/Setup3";
import Buy from "./Pages/Buy2";
import { Products } from "./Pages/Dash/Products";
import { Orders } from "./Pages/Dash/Orders";
import { Bookings } from "./Pages/Dash/Booking";
import { Analytics } from "./Pages/Dash/Analytics";
import { Pages } from "./Pages/Dash/Pages";
import { Linkinbio } from "./Pages/Pages/Linkinbio";
import { Storefronts } from "./Pages/Pages/Storefronts";
import { Workshops } from "./Pages/Pages/Workshops";
import { Pages as Page } from "./Pages/Pages/Pages";
import { Builder } from "./Pages/Pages/Builder";
import { BuilderForm } from "./Pages/Pages/BuilderForm";
import { Form } from "./Pages/Pages/Form";
import { Storefront } from "./Pages/Viewers/Storefront";

function App() {


  const httpLink = new HttpLink({ uri: "https://commercify-36b19c8d47f9.herokuapp.com/" })
  const authLink = setContext(async (req, { headers }) => {
    const token = localStorage.getItem("token")

    return {
      ...headers,
      headers: {
        Authorization: token ? `Bearer ${token}` : null,
      }
    }
  })



  const link = authLink.concat(httpLink)

  const client = new ApolloClient({
    link: link,
    cache: new InMemoryCache()
  })




  return (
    <ApolloProvider client={client}>

      <Router>
        <Routes>
          <Route element={<LandingPage />} path="/" />
          <Route element={<Register />} path="/register" />
          <Route element={<SignIn />} path='/login' />
          <Route element={<Authenticated><Buy /></Authenticated>} path='/buy'/>
          <Route element={<Authenticated><Form /></Authenticated>} path='/forms'/>
          <Route element={<Authenticated><Workshops /></Authenticated>} path='/workshops'/>
          <Route element={<Authenticated><Linkinbio /></Authenticated>} path='/linkinbio'/>
          <Route element={<Authenticated><Storefronts /></Authenticated>} path='/storefronts'/>
          <Route element={<Authenticated><Pages /></Authenticated>} path='/pages'/>
          <Route element={<Authenticated><Builder /></Authenticated>} path='/builder'/>
          <Route element={<Authenticated><BuilderForm /></Authenticated>} path='/builder/:type'/>
          <Route element={<Authenticated><Setup /></Authenticated>} path='/setup'/>
          <Route path='/storefront' element={
            <Storefront />
        } />
          <Route element={<Authenticated><Page /></Authenticated>} path='/page'/>
          <Route element={<Authenticated><Products /></Authenticated>} path='/products'/>
          <Route element={<Authenticated><Analytics /></Authenticated>} path='/analytics'/>
          <Route element={<Authenticated><Bookings /></Authenticated>} path='/bookings'/>
          <Route element={<Authenticated><Orders/></Authenticated>} path='/orders'/>
          <Route element={<Authenticated><Setup2 /></Authenticated>} path='/setup2'/>
          <Route element={<Authenticated><Setup3 /></Authenticated>} path='/setup3'/>
          <Route element={<Authenticated><Default /></Authenticated>} path='/dashboard' />
        </Routes>
      </Router>
    </ApolloProvider>
  )
}

export default App;
