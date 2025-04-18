export default function HeaderSection() {
  return (
    <div className="px-4 py-8 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="bg-gradient-to-r from-rose-500 to-purple-600 w-8 h-8 rounded-md flex items-center justify-center">
          <span className="text-white font-bold text-lg">S</span>
        </div>
        <h1 className="text-indigo-600 text-2xl font-bold">SHADDAY</h1>
      </div>
    </div>
  );
}
