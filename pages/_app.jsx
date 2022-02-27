import Helmet from "react-helmet"
import '../styles/globals.css'
import 'animate.css';

export default function App({ Component, pageProps }) {
    return (
        <>
            <Helmet defaultTitle="Lotus - Visual note taking with a twist." titleTemplate="%s - Lotus">
                <meta charSet='UTF-8' />
                <meta name='viewport' content='width=device-width, initial-scale=1.0' />
                <meta http-equiv='X-UA-Compatible' content='ie=edge' />
                <link rel='shortcut icon' href='/icon.png' />
                <link rel='apple-touch-icon' href='/icon.png' />
                <meta name="title" content="Lotus - Visual note taking with a twist." />
                <meta name="description" content="Lotus is a visual note taking app with a twist. It's a simple way to keep track of your thoughts and ideas." />
                <meta name="keywords" content="lotus, notes, taking, visual" />
                <meta name="theme-color" content="#9CCA87" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://lotus.vercel.app/" />
                <meta property="og:title" content="Lotus - Visual note taking with a twist." />
                <meta property="og:description" content="Lotus is a visual note taking app with a twist. It's a simple way to keep track of your thoughts and ideas." />
                <meta property="twitter:card" content="summary" />
                <meta property="twitter:url" content="https://lotus.vercel.app/" />
                <meta property="twitter:title" content="Lotus - Visual note taking with a twist." />
                <meta property="twitter:description" content="Lotus is a visual note taking app with a twist. It's a simple way to keep track of your thoughts and ideas." />
            </Helmet>

            <Component {...pageProps} />
        </>
    )
}