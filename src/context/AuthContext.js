// import React, { createContext, useState, useContext } from "react";

// // Crear el contexto
// const AuthContext = createContext();

// // Proveedor del contexto
// export const AuthProvider = ({ children }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [usuario, setUsuario] = useState("");
//   const [isAdmin, setIsAdmin] = useState(false); // Para los permisos de administrador

//   const login = (usuarioData) => {
//     setIsLoggedIn(true);
//     setUsuario(usuarioData.nombre);
//     setIsAdmin(usuarioData.isAdmin);
//   };

//   const logout = () => {
//     setIsLoggedIn(false);
//     setUsuario("");
//     setIsAdmin(false);
//   };

//   return (
//     <AuthContext.Provider
//       value={{ isLoggedIn, usuario, isAdmin, login, logout }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Hook para acceder al contexto
// export const useAuth = () => {
//   return useContext(AuthContext);
// };
