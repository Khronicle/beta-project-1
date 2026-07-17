const About = () => (
  <div className="mx-auto max-w-2xl">
    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">About</h1>
    <div className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
      <p>
        Beta Hub weather-dashboard is a small single-page application that shows current
        conditions and forecasts for any location in the world.
      </p>
      <p>
        Weather data is provided by{' '}
        <a
          href="https://open-meteo.com/"
          className="text-teal-600 hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          Open-Meteo
        </a>
        , a free open-source weather API that requires no API key.
      </p>
      <p>
        The app is built with React, TypeScript, Vite and Tailwind CSS.
      </p>
    </div>
  </div>
);

export default About;
