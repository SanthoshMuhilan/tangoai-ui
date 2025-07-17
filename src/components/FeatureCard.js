import React from 'react';

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-6 bg-white shadow rounded">
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  );
}

export default FeatureCard;
