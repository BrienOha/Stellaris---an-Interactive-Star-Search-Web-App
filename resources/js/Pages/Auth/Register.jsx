import { Head, Link, useForm } from '@inertiajs/react';
import CosmicLayout from '@/Layouts/CosmicLayout';
import { motion } from 'framer-motion';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <CosmicLayout>
            <Head title="New Commission" />
            
            <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#030508]">
                
                {/* Background Decor (Matching Login) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none"></div>

                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="w-full max-w-md relative z-10"
                >
                    {/* HOLOGRAPHIC CARD CONTAINER */}
                    <div className="bg-[#050714]/90 backdrop-blur-xl border-x border-b border-blue-500/30 rounded-lg p-10 shadow-[0_0_60px_rgba(0,0,0,0.8)] relative overflow-hidden">
                        
                        {/* Top Bar & Scan Line */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-blue-400/30 animate-[scan_4s_linear_infinite]"></div>

                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-mono font-bold text-white tracking-[0.2em] uppercase">Commission</h2>
                            <p className="text-blue-500 text-[10px] mt-2 font-mono uppercase tracking-[0.4em]">Register New Commander</p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            
                            {/* Name Input */}
                            <div className="relative group">
                                <label className="absolute -top-3 left-2 bg-[#050714] px-2 text-[10px] text-blue-400 font-mono tracking-widest uppercase transition-colors group-focus-within:text-white">
                                    Commander Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full bg-transparent border border-blue-800/50 rounded p-4 text-white focus:border-blue-400 focus:shadow-[0_0_15px_rgba(59,130,246,0.3)] outline-none transition-all font-mono tracking-wider"
                                    autoComplete="name"
                                    required
                                />
                                <p className="text-red-500 text-xs mt-1 font-mono">{errors.name}</p>
                            </div>

                            {/* Email Input */}
                            <div className="relative group">
                                <label className="absolute -top-3 left-2 bg-[#050714] px-2 text-[10px] text-blue-400 font-mono tracking-widest uppercase transition-colors group-focus-within:text-white">
                                    Secure Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full bg-transparent border border-blue-800/50 rounded p-4 text-white focus:border-blue-400 focus:shadow-[0_0_15px_rgba(59,130,246,0.3)] outline-none transition-all font-mono tracking-wider"
                                    autoComplete="username"
                                    required
                                />
                                <p className="text-red-500 text-xs mt-1 font-mono">{errors.email}</p>
                            </div>

                            {/* Password Input */}
                            <div className="relative group">
                                <label className="absolute -top-3 left-2 bg-[#050714] px-2 text-[10px] text-blue-400 font-mono tracking-widest uppercase transition-colors group-focus-within:text-white">
                                    Set Passkey
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full bg-transparent border border-blue-800/50 rounded p-4 text-white focus:border-blue-400 focus:shadow-[0_0_15px_rgba(59,130,246,0.3)] outline-none transition-all font-mono tracking-widest"
                                    autoComplete="new-password"
                                    required
                                />
                                <p className="text-red-500 text-xs mt-1 font-mono">{errors.password}</p>
                            </div>

                            {/* Confirm Password Input */}
                            <div className="relative group">
                                <label className="absolute -top-3 left-2 bg-[#050714] px-2 text-[10px] text-blue-400 font-mono tracking-widest uppercase transition-colors group-focus-within:text-white">
                                    Verify Passkey
                                </label>
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="w-full bg-transparent border border-blue-800/50 rounded p-4 text-white focus:border-blue-400 focus:shadow-[0_0_15px_rgba(59,130,246,0.3)] outline-none transition-all font-mono tracking-widest"
                                    autoComplete="new-password"
                                    required
                                />
                                <p className="text-red-500 text-xs mt-1 font-mono">{errors.password_confirmation}</p>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2">
                                <button 
                                    disabled={processing}
                                    className="w-full py-4 bg-gradient-to-r from-blue-900 to-blue-800 border border-blue-500/30 text-blue-100 font-bold font-mono tracking-[0.3em] uppercase rounded hover:from-blue-700 hover:to-blue-600 hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all duration-300 disabled:opacity-50"
                                >
                                    {processing ? 'Initialzing...' : 'Initialize Account'}
                                </button>
                            </div>

                            {/* Footer Link */}
                            <div className="text-center mt-4">
                                <Link 
                                    href={route('login')} 
                                    className="text-xs text-blue-400 hover:text-white transition uppercase decoration-blue-500/50 underline underline-offset-4 font-mono"
                                >
                                    Existing Commander? Login
                                </Link>
                            </div>
                        </form>
                    </div>
                    
                    {/* Decorative Corner Markers */}
                    <div className="absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-blue-500"></div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-blue-500"></div>
                </motion.div>
            </div>
        </CosmicLayout>
    );
}