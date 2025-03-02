import Group from '../../components/assets/Group'
import React from 'react'
import { gql, useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import twitter from '../../components/assets/twitter.svg'
import linkedin from '../../components/assets/Linkedin.svg'
import pinterest from '../../components/assets/pinterest.svg'
import linkden from '../../components/assets/linkden.svg'
import youtube from '../../components/assets/youtube.svg'
import spotify from '../../components/assets/Spotify.svg'
import medium from '../../components/assets/Medium.svg'
import yelp from '../../components/assets/Yelp.svg'
import zoom from '../../components/assets/Zoom.svg'
import behance from '../../components/assets/Behance.svg'
import dribble from '../../components/assets/Dribble.svg'
import googlemeet from '../../components/assets/GoogleMeets.svg'
import dropbox from '../../components/assets/Dropbox.svg'
import truth from '../../components/assets/TruthSocial.svg'
import notion from '../../components/assets/Notion.svg'
import github from '../../components/assets/GitHub.svg'
import reddit from '../../components/assets/Reddit.svg'
import patreon from '../../components/assets/Patreon.svg'
import twitch from '../../components/assets/twitch.svg'
const SIGNIN = gql`
  mutation login(
    $email: String!
    $password: String!
  ) {
    login(
      email: $email
      password: $password
    ) {
      token
    }
  }
`;

export const SignIn = () => {

  function shuffleArray(array) {
    return array
      .map((item) => ({ item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ item }) => item);
  }
  const images1 = shuffleArray([
    { name: 'Twitch', image: twitch },
    { name: 'Pinterest', image: pinterest },
    { name: 'Reddit', image: reddit },
    { name: 'Medium', image: medium },
    { name: 'Patreon', image: patreon },
    { name: 'Spotify', image: spotify },
    { name: 'Github', image: github },
    { name: 'LinkedIn', image: linkden },
    { name: 'Zoom', image: zoom },
    { name: 'Truth', image: truth },
    { name: 'Yelp', image: yelp },
    { name: 'Google Meets', image: googlemeet },
  ]);

  const images2 = shuffleArray([
    { name: 'Dribble', image: dribble },
    { name: 'Notion', image: notion },
    { name: 'Dropbox', image: dropbox },
    { name: 'Behance', image: behance },
    { name: 'Spotify', image: spotify },
    { name: 'Github', image: github },
    { name: 'Patreon', image: patreon },
    { name: 'Medium', image: medium },
    { name: 'Reddit', image: reddit },
    { name: 'Pinterest', image: pinterest },
    { name: 'Twitch', image: twitch },
  ]);

  const images3 = shuffleArray([
    { name: 'Google Meets', image: googlemeet },
    { name: 'Yelp', image: yelp },
    { name: 'Truth', image: truth },
    { name: 'Zoom', image: zoom },
    { name: 'LinkedIn', image: linkden },
    { name: 'Github', image: github },
    { name: 'Spotify', image: spotify },
    { name: 'Patreon', image: patreon },
    { name: 'Medium', image: medium },
    { name: 'Reddit', image: reddit },
    { name: 'Pinterest', image: pinterest },
    { name: 'Twitch', image: twitch },
  ]);
  const navigate = useNavigate();

  // Mutation for signup
  const [login, { error }] = useMutation(SIGNIN);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },

    onSubmit: async (values) => {
      try {
        const response = await login({
          variables: {
            email: values.email,
            password: values.password,
          },
        });
        const token = response.data.login.token;
        localStorage.setItem('token', token);
        navigate('/dashboard');
      } catch (err) {
        console.error('Login error:', err);
      }
    },
  });


  return (
    <div class='w-full'>
      <div class=' flex items-center justify-center relative'>

        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="flex items-center justify-center flex-col">
            <Group className='w-10 h-10' />
            <h2 className="mt-7 text-center font-['Semibold'] text-3xl leading-9 tracking-tight text-black">
              Welcome Back
            </h2>
          </div>

          <div className="mt-3 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div>

                <div className="mt-2 gap-2 flex flex-col">
                  <label class='font-["Semibold"] text-sm'>Email</label>
                  <input
                    id="email"
                    name="email"
                    placeholder='email@example.com'
                    type="email"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    required
                    autoComplete="email"
                    className="block w-full px-3 border text-sm font-['Medium'] rounded-xl py-3 text-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>

                <div className="mt-2 gap-2 flex flex-col">
                  <label class='font-["Semibold"] text-sm'>Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    placeholder='*******'
                    required
                    autoComplete="current-password"
                    className="block w-full rounded-xl text-sm font-['Medium'] border px-3 py-3 text-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              {error && (<div>{error.message}</div>)}


              <div>
                <button
                  type="submit"
                  className="flex w-full rounded-full justify-center bg-black px-3 py-3 font-['Semibold'] leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign in
                </button>

                <a
                  href='/beta'
                  className="flex mt-2 w-full rounded-full justify-center border px-3 py-3 font-['Semibold'] leading-6 text-black hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Create account
                </a>
              </div>

              <div class='text-gray-400 text-center text-xs font-["Medium"]'>By signing up you are agreeing to our <div class='text-black font-["Semibold"]'>terms of use</div></div>
                <div class='rounded-md mt-5 text-gray-400 border text-center p-2 bottom-5 text-xs font-["Medium"]'>
                  <div>  By continuing to browse our site you are accepting our <a class='font-["Semibold"] text-black'>cookie policy</a></div>
                </div>
            </form>


          </div>
        </div>
      </div>

    </div>
  )
}