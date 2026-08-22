import React from "react";
import { FiUsers, FiTarget, FiAward, FiClock } from "react-icons/fi";

const Section = ({ icon: Icon, title, children }) => (
  <section className="bg-white rounded-xl border border-slate-100 shadow-card p-6">
    <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
      <Icon className="text-primary-500" /> {title}
    </h2>
    {children}
  </section>
);

const AboutUs = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-5">
      <div className="text-center mb-2">
        <h1 className="text-3xl font-bold text-slate-900">About Us</h1>
        <p className="text-sm text-slate-500 mt-1">
          Getting to know the team behind the marketplace
        </p>
      </div>

      <Section icon={FiClock} title="Our History">
        <p className="text-sm text-slate-600 leading-relaxed">
          Founded in 2020, our company started with a simple vision: to
          provide high-quality products at affordable prices. Over the years,
          we have grown into a trusted name in the e-commerce industry,
          serving thousands of satisfied customers.
        </p>
      </Section>

      <Section icon={FiTarget} title="Our Mission">
        <p className="text-sm text-slate-600 leading-relaxed">
          Our mission is to empower consumers by offering a diverse range of
          products that meet their needs while providing exceptional customer
          service. We believe in transparency, quality, and sustainability.
        </p>
      </Section>

      <Section icon={FiUsers} title="Meet the Team">
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { name: "John Doe", role: "CEO & Founder", blurb: "A visionary dedicated to creating a customer-centric culture." },
            { name: "Jane Smith", role: "Chief Operating Officer", blurb: "Ensuring our operations run smoothly and efficiently." },
            { name: "Emily Johnson", role: "Head of Marketing", blurb: "Driving our marketing strategies to reach new customers." },
          ].map((member) => (
            <div
              key={member.name}
              className="bg-slate-50 rounded-xl border border-slate-100 p-4"
            >
              <h3 className="font-semibold text-slate-800">{member.name}</h3>
              <p className="text-xs text-primary-600 font-medium mt-0.5">
                {member.role}
              </p>
              <p className="text-sm text-slate-500 mt-2">{member.blurb}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section icon={FiAward} title="Achievements">
        <ul className="text-sm text-slate-600 space-y-1.5 list-disc pl-5">
          <li>Over 100,000 satisfied customers.</li>
          <li>Featured in major publications for our innovative products.</li>
          <li>Recognized as a top e-commerce platform in 2023.</li>
        </ul>
      </Section>
    </div>
  );
};

export default AboutUs;
