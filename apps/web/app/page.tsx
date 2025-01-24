import Image from 'next/image';

export default function Home() {
  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">浮力引擎</h1>
        <p className="text-xl text-gray-600 mb-8">发现更多精彩内容</p>
      </div>
      <img src="/app-icon.webp" alt="App Icon" className="rounded-3xl shadow-lg mb-8 w-[200px] h-[200px]" />
      <a 
        href="/download" 
        className="bg-blue-500 text-white px-6 py-3 rounded-full text-xl font-medium hover:bg-blue-600 transition duration-300"
      >
        立即下载
      </a>
    </div>
  );
}
