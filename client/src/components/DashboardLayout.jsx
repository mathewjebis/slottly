import Navbar from "./Navbar";

const DashboardLayout = ({ children, wide = false }) => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main
        className={`mx-auto px-4 py-8 sm:px-6 ${wide ? "max-w-6xl" : "max-w-6xl"}`}
      >
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
