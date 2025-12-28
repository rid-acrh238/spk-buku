import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaLock, FaEnvelope, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true); 
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Satu state untuk semua input
    const [form, setForm] = useState({ nama_lengkap: '', username: '', password: '' });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Tentukan endpoint backend
            const endpoint = isLogin ? '/login' : '/register'; // Pastikan route backend sesuai
            const res = await api.post(endpoint, form);

            if (isLogin) {
                // Simpan token dan data user
                localStorage.setItem('token', res.data.token);
                // Decode token atau simpan nama mentah (tergantung respon backend)
                localStorage.setItem('user_name', form.username); 
                
                Swal.fire({ icon: 'success', title: 'Login Berhasil!', timer: 1500, showConfirmButton: false });
                navigate('/dashboard');
            } else {
                Swal.fire('Berhasil!', 'Akun dibuat, silakan login.', 'success');
                setIsLogin(true); // Pindah ke mode login
            }
        } catch (err) {
            Swal.fire('Gagal', err.response?.data?.msg || 'Terjadi kesalahan', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
            >
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 tracking-wide">
                        {isLogin ? 'Selamat Datang' : 'Buat Akun'}
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Sistem Pendukung Keputusan (SAW)</p>
                </div>

                <AnimatePresence mode='wait'>
                    <motion.form 
                        key={isLogin ? "login" : "register"}
                        initial={{ x: isLogin ? -50 : 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: isLogin ? 50 : -50, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >
                        {/* Input Nama (Hanya muncul saat Register) */}
                        {!isLogin && (
                            <div className="relative">
                                <FaUser className="absolute top-3.5 left-3 text-gray-400" />
                                <input name="nama_lengkap" type="text" placeholder="Nama Lengkap" onChange={handleChange}
                                    className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" required />
                            </div>
                        )}

                        <div className="relative">
                            <FaEnvelope className="absolute top-3.5 left-3 text-gray-400" />
                            <input name="username" type="text" placeholder="Username" onChange={handleChange}
                                className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" required />
                        </div>

                        <div className="relative">
                            <FaLock className="absolute top-3.5 left-3 text-gray-400" />
                            <input name="password" type="password" placeholder="Password" onChange={handleChange}
                                className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" required />
                        </div>

                        <motion.button 
                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}
                            disabled={loading}
                            className={`w-full py-3 rounded-xl text-white font-bold shadow-lg flex justify-center items-center gap-2 transition
                            ${isLogin ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-pink-500 hover:bg-pink-600'}`}
                        >
                            {loading ? 'Memproses...' : (isLogin ? <><FaSignInAlt /> Masuk</> : <><FaUserPlus /> Daftar</>)}
                        </motion.button>
                    </motion.form>
                </AnimatePresence>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
                        <button onClick={() => setIsLogin(!isLogin)} className="font-bold text-purple-600 hover:underline">
                            {isLogin ? "Daftar Sekarang" : "Login Disini"}
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

// import { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FaUser, FaLock, FaEnvelope, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
// import Swal from 'sweetalert2';
// import api from '../api';
// import { useNavigate } from 'react-router-dom';

// export default function AuthPage() {
//     const [isLogin, setIsLogin] = useState(true); // State untuk cek lagi mode Login atau Daftar
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();

//     // State Form (Digabung biar hemat baris)
//     const [form, setForm] = useState({ nama: '', username: '', password: '' });

//     const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         try {
//             const endpoint = isLogin ? '/login' : '/register';
//             const res = await api.post(endpoint, form);

//             if (isLogin) {
//                 localStorage.setItem('token', res.data.token);
//                 localStorage.setItem('user', JSON.stringify({ nama: res.data.nama })); // Simpan nama buat dashboard
//                 Swal.fire({ icon: 'success', title: 'Welcome!', timer: 1500, showConfirmButton: false });
//                 navigate('/dashboard');
//             } else {
//                 Swal.fire('Berhasil!', 'Akun dibuat, silakan login.', 'success');
//                 setIsLogin(true); // Pindah ke mode login
//             }
//         } catch (err) {
//             Swal.fire('Gagal', err.response?.data?.msg || 'Terjadi kesalahan', 'error');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
//             <motion.div 
//                 initial={{ opacity: 0, y: -50 }} 
//                 animate={{ opacity: 1, y: 0 }} 
//                 className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
//             >
//                 {/* Header Animatif */}
//                 <div className="text-center mb-8">
//                     <h1 className="text-3xl font-bold text-gray-800 tracking-wide">
//                         {isLogin ? 'Selamat Datang' : 'Buat Akun Baru'}
//                     </h1>
//                     <p className="text-gray-500 text-sm mt-2">Sistem Pendukung Keputusan (SAW)</p>
//                 </div>

//                 {/* Form Wrapper dengan Animasi Ganti Mode */}
//                 <AnimatePresence mode='wait'>
//                     <motion.form 
//                         key={isLogin ? "login" : "register"}
//                         initial={{ x: isLogin ? -100 : 100, opacity: 0 }}
//                         animate={{ x: 0, opacity: 1 }}
//                         exit={{ x: isLogin ? 100 : -100, opacity: 0 }}
//                         transition={{ duration: 0.3 }}
//                         onSubmit={handleSubmit}
//                         className="space-y-5"
//                     >
//                         {!isLogin && (
//                             <div className="relative group">
//                                 <FaUser className="absolute top-3.5 left-3 text-gray-400 group-focus-within:text-purple-600 transition" />
//                                 <input name="nama" type="text" placeholder="Nama Lengkap" onChange={handleChange}
//                                     className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition" required />
//                             </div>
//                         )}

//                         <div className="relative group">
//                             <FaEnvelope className="absolute top-3.5 left-3 text-gray-400 group-focus-within:text-purple-600 transition" />
//                             <input name="username" type="text" placeholder="Username" onChange={handleChange}
//                                 className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition" required />
//                         </div>

//                         <div className="relative group">
//                             <FaLock className="absolute top-3.5 left-3 text-gray-400 group-focus-within:text-purple-600 transition" />
//                             <input name="password" type="password" placeholder="Password" onChange={handleChange}
//                                 className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition" required />
//                         </div>

//                         <motion.button 
//                             whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}
//                             disabled={loading}
//                             className={`w-full py-3 rounded-xl text-white font-bold shadow-lg flex justify-center items-center gap-2 transition
//                             ${isLogin ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-indigo-500/50' : 'bg-gradient-to-r from-pink-500 to-orange-500 hover:shadow-orange-500/50'}`}
//                         >
//                             {loading ? 'Memproses...' : (isLogin ? <><FaSignInAlt /> Masuk</> : <><FaUserPlus /> Daftar</>)}
//                         </motion.button>
//                     </motion.form>
//                 </AnimatePresence>

//                 {/* Footer Toggle */}
//                 <div className="mt-6 text-center">
//                     <p className="text-sm text-gray-600">
//                         {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
//                         <button 
//                             onClick={() => setIsLogin(!isLogin)} 
//                             className="font-bold text-purple-600 hover:underline focus:outline-none"
//                         >
//                             {isLogin ? "Daftar Sekarang" : "Login Disini"}
//                         </button>
//                     </p>
//                 </div>
//             </motion.div>
//         </div>
//     );
// }