import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout';
import Home from './pages/Home/Home';
import Forecast from './pages/Forecast/Forecast';
import About from './pages/About/About';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/forecast" element={<Forecast />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
