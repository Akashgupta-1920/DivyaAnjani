import { FaHistory, FaFlask, FaAward } from 'react-icons/fa';
import bgImage from "../assets/ressearch/r1.jpeg";

function Research() {
  return (
    <div className="pt-0">
      {/* Hero Section with Background Image */}
      <div
        className="bg-cover bg-center text-white h-[60vh] mb-10"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="flex items-center justify-center bg-black bg-opacity-50 h-full">
          <h1 className="text-5xl font-bold text-center px-4">Our Journey & Research</h1>
        </div>
      </div>

      {/* Parallel History and Research Sections */}
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        {/* History Section */}
{/* History Section */}
<section className="bg-white rounded-lg shadow-lg p-8 transform transition duration-300 hover:scale-105 hover:shadow-2xl">
  <div className="flex items-center mb-6">
    <FaHistory className="text-3xl text-secondary mr-4" />
    <h2 className="text-3xl font-semibold">Our History</h2>
  </div>
  <p className="text-lg text-gray-700 mb-4">
    Founded in 1995, AyurVaid began with a simple mission: to bring the ancient wisdom of Ayurveda to modern wellness seekers. Our journey started with a small clinic in the heart of Kerala, India, the birthplace of Ayurveda.
  </p>
  <p className="text-lg text-gray-700">
    Over the years, we've grown from a single clinic to a global brand, but our commitment to authentic Ayurvedic principles remains unchanged. We've helped thousands of people discover natural ways to improve their health and well-being.
  </p>
</section>

{/* Research & Development */}
<section className="bg-white rounded-lg shadow-lg p-8 transform transition duration-300 hover:scale-105 hover:shadow-2xl">
  <div className="flex items-center mb-6">
    <FaFlask className="text-3xl text-secondary mr-4" />
    <h2 className="text-3xl font-semibold">Research & Development</h2>
  </div>
  <p className="text-lg text-gray-700 mb-6">
    Our state-of-the-art research facility combines traditional Ayurvedic knowledge with modern scientific methods. Our team of researchers and practitioners work tirelessly to validate ancient formulations and develop new solutions for contemporary health challenges.
  </p>
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
    <div className="bg-gray-100 p-4 rounded text-center">
      <h3 className="font-bold text-2xl text-primary">50+</h3>
      <p className="text-sm">Research Papers Published</p>
    </div>
    <div className="bg-gray-100 p-4 rounded text-center">
      <h3 className="font-bold text-2xl text-primary">1000+</h3>
      <p className="text-sm">Clinical Trials Conducted</p>
    </div>
    <div className="bg-gray-100 p-4 rounded text-center">
      <h3 className="font-bold text-2xl text-primary">25+</h3>
      <p className="text-sm">Years of Research</p>
    </div>
  </div>
</section>

      </div>

      {/* Certifications */}
      <div className="container mx-auto px-6">
        <section className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center mb-6">
            <FaAward className="text-3xl text-secondary mr-4" />
            <h2 className="text-3xl font-semibold">Certifications & Recognition</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Quality Certifications</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>GMP (Good Manufacturing Practice) Certified</li>
                <li>ISO 9001:2015 Certified</li>
                <li>AYUSH Premium Mark</li>
                <li>WHO-GMP Certified</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Awards & Recognition</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Best Ayurvedic Research Center 2023</li>
                <li>Innovation in Natural Healthcare 2022</li>
                <li>Excellence in Ayurvedic Medicine 2021</li>
                <li>Global Ayurveda Leadership Award 2020</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Research;