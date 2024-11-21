import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="relative flex flex-col bg-[#161819] bg-hero-pattern bg-cover bg-no-repeat bg-center h-full max-h-screen w-full text-white overflow-x-hidden overflow-y-auto">
      <Navbar />
      {children}
      <Sidebar />
    </div>
  );
}
