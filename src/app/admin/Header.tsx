export default function Header({ userName }: { userName: string }) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-lg font-semibold text-gray-800">Painel Administrativo</h1>
        <p className="text-sm text-gray-500">Gerencie seus blogs e conteúdo</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
          {userName.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm text-gray-700">{userName}</span>
      </div>
    </header>
  );
}