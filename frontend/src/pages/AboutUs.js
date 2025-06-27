import React from "react";

const AboutUs = () => {
  return (
    <div className="container mx-auto my-6 px-4">
      <h1 className="text-3xl font-bold text-center mb-6">About Us</h1>

      <section className="mb-6 p-6 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Our History</h2>
        <p className="text-gray-700">
          Founded in 2020, our company started with a simple vision: to provide
          high-quality products at affordable prices. Over the years, we have
          grown into a trusted name in the e-commerce industry, serving
          thousands of satisfied customers.
        </p>
      </section>

      <section className="mb-6 p-6 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="text-gray-700">
          Our mission is to empower consumers by offering a diverse range of
          products that meet their needs while providing exceptional customer
          service. We believe in transparency, quality, and sustainability.
        </p>
      </section>

      <section className="mb-6 p-6 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Meet the Team</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-300 hover:shadow-xl transition">
            <h3 className="font-semibold">John Doe</h3>
            <p className="text-gray-600">CEO & Founder</p>
            <p>A visionary dedicated to creating a customer-centric culture.</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-300 hover:shadow-xl transition">
            <h3 className="font-semibold">Jane Smith</h3>
            <p className="text-gray-600">Chief Operating Officer</p>
            <p>Ensuring our operations run smoothly and efficiently.</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-300 hover:shadow-xl transition">
            <h3 className="font-semibold">Emily Johnson</h3>
            <p className="text-gray-600">Head of Marketing</p>
            <p>Driving our marketing strategies to reach new customers.</p>
          </div>
        </div>
      </section>

      <section className="mb-6 p-6 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Achievements</h2>
        <ul className="list-disc pl-5 text-gray-700">
          <li>Over 100,000 satisfied customers.</li>
          <li>Featured in major publications for our innovative products.</li>
          <li>Recognized as a top e-commerce platform in 2023.</li>
        </ul>
      </section>

      <section className="p-6 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Videos</h2>
        <p className="text-gray-700 mb-2">Watch our story:</p>
        {/* Placeholder for video */}
        <iframe
          width="100%"
          height="315"
          src="https://www.youtube.com/embed/your_video_id"
          title="About Us Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </section>
    </div>
  );
};

export default AboutUs;
