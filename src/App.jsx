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
import { Products } from "./Pages/Dash/Products";
import { Orders } from "./Pages/Dash/Orders";
import { Analytics } from "./Pages/Dash/Analytics";
import { Pricing } from './Pages/Pages/Pricing'
import { Builder } from "./Pages/Pages/Builder";
import { Linkinbio } from "./Pages/Viewers/Page";
import { Beta } from "./components/Beta";
import { Confirmation } from "./components/Confirmation";
import { Audience } from "./Pages/Dash/Audience";
import { Settings } from "./Pages/Dash/Settings";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Order } from "./Pages/Dash/Nested/Order";
import { Product } from "./Pages/Dash/Nested/Product";

function App() {

  const PUBLIC_KEY = "pk_test_51IiQZPD7NsuORBccbQ1juDSZc21IQIO8OJlwGouoRSLfbNAFvCeQjFDQzDQwW1w0iu63c2NLsLIDtPBa7zpQjSCv00EE8T2Snh"

  const stripeTestPromise = loadStripe(PUBLIC_KEY)

  const httpLink = new HttpLink({
    uri: "https://commercifybackend-j0o4.onrender.com/", // Replace with your GraphQL API URI
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
      <Elements stripe={stripeTestPromise}>
        <Ana />
        <Router>
          <Routes>
            <Route element={<LandingPage />} path="/" />
            <Route element={<Register />} path="/register" />
            <Route element={<SignIn />} path='/login' />
            <Route element={<Authenticated><Order /></Authenticated>} path='/orders/:id' />
            <Route element={<Beta />} path='/beta' />
            <Route element={<Authenticated><Builder /></Authenticated>} path='/editor' />
            <Route element={<Pricing />} path='/pricing' />
            <Route element={<Confirmation />} path='/confirmation' />

            <Route element={<Authenticated><Setup /></Authenticated>} path='/setup' />

            <Route path='/:subdomain' element={<Linkinbio />} />
            <Route element={<Authenticated><Products /></Authenticated>} path='/products' />
            <Route element={<Authenticated><Analytics /></Authenticated>} path='/stats' />
            <Route element={<Authenticated><Orders /></Authenticated>} path='/orders' />
            <Route element={<Authenticated><Product /></Authenticated>} path='/product/:id' />
            <Route element={<Authenticated><Setup2 /></Authenticated>} path='/setup2' />
            <Route element={<Authenticated><Audience /></Authenticated>} path='/audience' />
            <Route element={<Authenticated><Setup3 /></Authenticated>} path='/setup3' />
            <Route element={<Authenticated><Default /></Authenticated>} path='/dashboard' />
            <Route element={<Authenticated><Settings /></Authenticated>} path='/settings' />
          </Routes>
        </Router>
      </Elements>
    </ApolloProvider>
  )
}

export default App;
