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
import { Analytics as Ana } from '@vercel/analytics/react'
import Buy from "./Pages/Buy2";
import { Products } from "./Pages/Dash/Products";
import { Orders } from "./Pages/Dash/Orders";
import { Bookings } from "./Pages/Dash/Booking";
import { Analytics } from "./Pages/Dash/Analytics";
import { Pricing} from './Pages/Pages/Pricing'
import { Pages } from "./Pages/Dash/Pages";
import { Storefronts } from "./Pages/Pages/Storefronts";
import { Workshops } from "./Pages/Pages/Workshops";
import { Pages as Page } from "./Pages/Pages/Pages";
import { Builder } from "./Pages/Pages/Builder";
import { BuilderForm } from "./Pages/Pages/BuilderForm";
import { Form } from "./Pages/Pages/Form";
import { Storefront } from "./Pages/Viewers/Storefront";
import { Linkinbio } from "./Pages/Viewers/Linkinbio";
import { Linkinbio as LinkBuilder} from "./Pages/Pages/Linkinbio";
import { Insights } from "./Pages/Pages/Insights";
import { Beta } from "./components/Beta";
import { Confirmation } from "./components/Confirmation";
import { Audience } from "./Pages/Dash/Audience";
import { Settings } from "./Pages/Dash/Settings";

function App() {

  const httpLink = new HttpLink({
    uri: "http://localhost:4000/", // Replace with your GraphQL API URI
  });
  
  // Create an Auth Link to include the Authorization header
  const authLink = setContext(async (_, { headers }) => {
    // Get the token from localStorage
    const token = localStorage.getItem("token");
  
    // Return the headers with the Authorization header
    return {
      headers: {
        ...headers, // Spread existing headers
        Authorization: token ? `Bearer ${token}` : "", // Add token if present
      },
    };
  });
  
  // Combine the authLink and httpLink
  const link = authLink.concat(httpLink);
  
  // Create the Apollo Client instance with cache and link
  const client = new ApolloClient({
    link: link,
    cache: new InMemoryCache(),
  });
  




  return (
    <ApolloProvider client={client}>
      <Ana />
      <Router>
        <Routes>
          <Route element={<LandingPage />} path="/" />
          <Route element={<Register />} path="/register" />
          <Route element={<SignIn />} path='/login' />
          <Route element={<Authenticated><Buy /></Authenticated>} path='/buy'/>
          <Route element={<Authenticated><Form /></Authenticated>} path='/forms'/>
          <Route element={<Authenticated><Workshops /></Authenticated>} path='/workshops'/>
          <Route element={<Authenticated><LinkBuilder /></Authenticated>} path='/linkinbio'/>
          <Route element={<Authenticated><Storefronts /></Authenticated>} path='/storefronts'/>
          <Route element={<Authenticated><Pages /></Authenticated>} path='/pages'/>
          <Route element={<Beta />}  path='/beta' />
          <Route element={<Authenticated><Builder /></Authenticated>} path='/editor'/>
          <Route element={<Pricing />} path='/pricing'/>
          <Route element={<Confirmation />} path='/confirmation'/>
          <Route element={<Authenticated><BuilderForm /></Authenticated>} path='/builder/:type'/>
          <Route element={<Authenticated><Setup /></Authenticated>} path='/setup'/>
          <Route path='/storefront' element={
            <Storefront />
        } />
        <Route path='/:subdomain' element={<Linkinbio/>}/>
        <Route element={<Authenticated><Insights /></Authenticated>} path='/insights' />
          <Route element={<Authenticated><Page /></Authenticated>} path='/page'/>
          <Route element={<Authenticated><Products /></Authenticated>} path='/products'/>
          <Route element={<Authenticated><Analytics /></Authenticated>} path='/stats'/>
          <Route element={<Authenticated><Bookings /></Authenticated>} path='/bookings'/>
          <Route element={<Authenticated><Orders/></Authenticated>} path='/orders'/>
          <Route element={<Authenticated><Setup2 /></Authenticated>} path='/setup2'/>
          <Route element={<Authenticated><Audience /></Authenticated>} path='/audience'/>
          <Route element={<Authenticated><Setup3 /></Authenticated>} path='/setup3'/>
          <Route element={<Authenticated><Default /></Authenticated>} path='/dashboard' />
          <Route element={<Authenticated><Settings /></Authenticated>} path='/settings'/>
        </Routes>
      </Router>
    </ApolloProvider>
  )
}

export default App;
