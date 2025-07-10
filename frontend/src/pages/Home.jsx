import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-blue-700 text-white py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Welcome to RadAtlas</h1>
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
              <Link to={item.path} key={idx} className="border rounded-lg p-6 shadow hover:shadow-lg transition">
                <h3 className="text-xl font-semibold text-blue-700 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 text-center py-6 text-sm mt-12">
        &copy; {new Date().getFullYear()} RadAtlas | Built for medical learning and growth.
      </footer>
    </div>
  );
};

export default Home;
