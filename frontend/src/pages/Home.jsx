import { Link } from "react-router-dom";
import { FaVideo, FaBookMedical, FaXRay, FaBookOpen } from "react-icons/fa";

const Home = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-slate-950 text-white py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Welcome to EverCare Radiology</h1>
          <p className="text-lg md:text-xl mb-6">Your all-in-one platform for radiology education and case exploration.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/atlas"
              className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-100"
            >
              Explore Atlas
            </Link>
            <Link
              to="/cases"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600"
            >
              View Cases
            </Link>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="bg-gray-100 py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="bg-white p-6 rounded shadow hover:shadow-md transition">
            <FaVideo className="text-3xl text-purple-700 mb-2 mx-auto" />
            <p className="text-lg font-bold">1k+ Videos</p>
            <p className="text-sm text-gray-500">Expert-led radiology tutorials</p>
          </div>
          <div className="bg-white p-6 rounded shadow hover:shadow-md transition">
            <FaXRay className="text-3xl text-blue-700 mb-2 mx-auto" />
            <p className="text-lg font-bold">500+ Cases</p>
            <p className="text-sm text-gray-500">Real-world diagnostic examples</p>
          </div>
          <div className="bg-white p-6 rounded shadow hover:shadow-md transition">
            <FaBookMedical className="text-3xl text-green-700 mb-2 mx-auto" />
            <p className="text-lg font-bold">300+ Atlas Images</p>
            <p className="text-sm text-gray-500">Labeled cross-sectional anatomy</p>
          </div>
          <div className="bg-white p-6 rounded shadow hover:shadow-md transition">
            <FaBookOpen className="text-3xl text-amber-600 mb-2 mx-auto" />
            <p className="text-lg font-bold">100+ eBooks</p>
            <p className="text-sm text-gray-500">Radiology references and guides</p>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-12 px-4 bg-purple-950 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-6">Quick Access</h2>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link to="/atlas" className="bg-blue-600 px-6 py-3 rounded shadow hover:bg-blue-700">
              🧠 Explore Atlas
            </Link>
            <Link to="/cases" className="bg-green-600 px-6 py-3 rounded shadow hover:bg-green-700">
              🦴 View Cases
            </Link>
            <Link to="/courses" className="bg-purple-600 px-6 py-3 rounded shadow hover:bg-purple-700">
              🎓 Watch Courses
            </Link>
            <Link to="/ebooks" className="bg-amber-600 px-6 py-3 rounded shadow hover:bg-amber-700">
              📘 Read eBooks
            </Link>
            <Link to="/quiz" className="bg-red-600 px-6 py-3 rounded shadow hover:bg-red-700">
              🧪 Take Quiz
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">What You Can Access</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Anatomy Atlas",
                desc: "Explore cross-sectional CT, MRI and X-ray anatomy with labeled images.",
                path: "/atlas",
              },
              {
                title: "Case Studies",
                desc: "Browse curated clinical cases with diagnostic insights.",
                path: "/cases",
              },
              {
                title: "Courses",
                desc: "Watch expert lectures and tutorials on radiology concepts.",
                path: "/courses",
              },
              {
                title: "eBooks",
                desc: "Download or read recommended radiology textbooks and manuals.",
                path: "/ebooks",
              },
            ].map((item, idx) => (
              <Link to={item.path} key={idx} className="border rounded-lg p-6 shadow hover:shadow-lg transition bg-purple-950">
                <h3 className="text-xl font-semibold text-blue-300 mb-2">{item.title}</h3>
                <p className="text-sm text-white">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-gray-300 text-center py-6 text-sm mt-12">
        &copy; {new Date().getFullYear()} EverCare Radiology | Built for medical learning and growth.
      </footer>
    </div>
  );
};

export default Home;
