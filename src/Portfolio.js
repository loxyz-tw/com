import React from 'react';

const projects = [
  { title: 'AI 語音模型', category: 'AI', description: '語音辨識應用' },
  { title: '行動購物 App', category: 'App', description: '跨平台解決方案' }
];

export default function Portfolio() {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-4">專案成果</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <div key={index} className="p-6 border rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">{project.title}</h3>
            <p className="mt-2 text-gray-600">{project.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
