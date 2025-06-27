import { useAuth } from "../../contexts/AuthContext";

function Logo({ logo }) {
  const { user, loading } = useAuth();

  return (
    <div className="flex flex-row items-center space-x-2  ">
      <img
        src={logo}
        className="w-10 h-10 transition-transform duration-300 hover:scale-110"
        alt="logo"
      />
      <h1 className="text-4xl font-mono font-semibold text-blue-700 tracking-wide transition-colors duration-300 hover:text-blue-600">
        SHOPIFY
      </h1>
    </div>
  );
}

export default Logo;
