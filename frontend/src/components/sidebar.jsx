import { createContext, useContext, useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import profilImage from '../assets/profil.png';
import { Link } from "react-router-dom"; // Import Link di sini
import axios from "axios";

const SidebarContext = createContext();

export function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(true);
  const [profileName, setProfileName] = useState(""); // State untuk nama pengguna
  const [role, setRole] = useState(""); // State untuk role

  // Ambil role dari localStorage dan set ke state role
  useEffect(() => {
    const storedRole = localStorage.getItem("role"); // Mengambil role dari localStorage
    if (storedRole) {
      setRole(storedRole); // Menyimpan role ke state
    } else {
      console.error("Role tidak ditemukan di localStorage");
      // Bisa redirect ke halaman login jika role tidak ditemukan
    }
  }, []);

  // Ambil data nama berdasarkan role (admin/user)
  useEffect(() => {
    if (!role) return; // Role harus ada sebelum memanggil API
  
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("userToken");
  
        if (!token) {
          console.error("Token tidak ditemukan.");
          return;
        }
  
        const endpoint = role === "admin" ? "/api/admin/profile" : "http://localhost:3000/api/user/profile"; // Gunakan URL lengkap untuk user
  
        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        console.log("Respons API:", response.data);
  
        // Set nama berdasarkan role
        if (role === "admin") {
          setProfileName("Admin Titipin");
        } else if (role === "user" && response.data.success && response.data.data?.name) {
          setProfileName(response.data.data.name); // Ambil nama user dari respons
        } else {
          console.error("Nama tidak ditemukan dalam respons API.");
        }
      } catch (error) {
        console.error("Gagal memanggil API profil:", error);
      }
    };
  
    fetchProfile();
  }, [role]);

  return (
    <aside className="h-min-screen">
      <nav className="h-full flex flex-col bg-emerald-500 border-r shadow-sm">
        <div className="p-4 pb-2 flex items-center">
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-0 bg-transparent border-0 flex items-center mr-4 justify-center focus:outline-none"
          >
            {expanded ? (
              <FiChevronLeft size={24} className="text-white" />
            ) : (
              <FiChevronRight size={24} className="text-white" />
            )}
          </button>
          <p
            className={`overflow-hidden transition-all text-xl font-semibold text-white ${
              expanded ? "w-32" : "w-0"
            }`}
          >
            Titipin
          </p>
        </div>

        <SidebarContext.Provider value={expanded}>
          <ul className="flex-1 px-2">{children}</ul>
        </SidebarContext.Provider>
        <div className="border-t flex p-2 items-center justify-center">
          <img
            src={profilImage}
            className="h-8 w-8 rounded-full"
            alt="Profile"
          />
          <div
            className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}
          >
            <h4 className="text-white text-xs font-semibold">
              {profileName } 
            </h4>
          </div>
        </div>
      </nav>
    </aside>
  );
}

export function SidebarItem({ icon, text, route, active, alert, keluar, beranda }) {
  const expanded = useContext(SidebarContext);

  const itemClass = keluar
    ? "text-red-500 hover:bg-red-100"
    : beranda
    ? "text-blue-500 hover:bg-blue-100 mt-5"
    : active
    ? "bg-white text-emerald-600"
    : "text-white hover:bg-emerald-400";

  const hoverClass = keluar
    ? "bg-red-100 text-red-500"
    : beranda
    ? "bg-blue-100 text-blue-500"
    : "bg-emerald-100 text-emerald-500";

  const alertClass = keluar
    ? "bg-red-500"
    : beranda
    ? "bg-blue-500"
    : "bg-emerald-400";

  const Wrapper = route ? Link : "div";
  const wrapperProps = route ? { to: route } : {};

  return (
    <li
      className={`relative flex items-center mx-3 py-2 px-2 my-1 font-medium rounded-md cursor-pointer transition-colors group ${itemClass}`}
    >
      <Wrapper {...wrapperProps} className="flex items-center w-full h-full">
        {icon}
        <span
          className={`overflow-hidden transition-all text-xs font-medium ${
            expanded ? "w-52 ml-3" : "w-0"
          }`}
        >
          {text}
        </span>
      </Wrapper>

      {!expanded && (
        <div
          className={`absolute text-xs font-medium left-full opacity-0 rounded-md px-2 py-1 ml-6 ${hoverClass} -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
        >
          {text}
        </div>
      )}

      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded ${alertClass} top-1/2 transform -translate-y-1/2 invisible group-hover:visible group-hover:opacity-100`}
        />
      )}
    </li>
  );
}
