import { Head, Link, useForm } from '@inertiajs/react';
import CosmicLayout from '@/Layouts/CosmicLayout';
import { motion } from 'framer-motion';

export default function Login({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '', password: '', remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <CosmicLayout>
            <Head title="Access Terminal" />
            <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#030508]">
                
                {/* Background Decor */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/10 blur-[100px] rounded-full"></div>
                
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="w-full max-w-md relative z-10"
                >
                    {/* HOLOGRAPHIC TERMINAL CONTAINER */}
                    <div className="bg-[#050714]/90 backdrop-blur-xl border-x border-b border-blue-500/30 rounded-lg p-10 shadow-[0_0_60px_rgba(0,0,0,0.8)] relative overflow-hidden">
                        
                        {/* Top Bar (Tech Style) */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-blue-400/30 animate-[scan_4s_linear_infinite]"></div>

                        <div className="text-center mb-10">
                            <h2 className="text-4xl font-mono font-bold text-white tracking-[0.2em]">LOGIN</h2>
                            <p className="text-blue-500 text-[10px] mt-2 font-mono uppercase tracking-[0.4em]">Secure Uplink // V.2.0</p>
                        </div>

                        <form onSubmit={submit} className="space-y-8">
                            {/* Email Field */}
                            <div className="relative group">
                                <label className="absolute -top-3 left-2 bg-[#050714] px-2 text-[10px] text-blue-400 font-mono tracking-widest uppercase">
                                    Commander ID (Email)
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full bg-transparent border border-blue-800/50 rounded p-4 text-white focus:border-blue-400 focus:shadow-[0_0_15px_rgba(59,130,246,0.3)] outline-none transition-all font-mono tracking-wider"
                                />
                                <p className="text-red-500 text-xs mt-1 font-mono">{errors.email}</p>
                            </div>

                            {/* Password Field */}
                            <div className="relative group">
                                <label className="absolute -top-3 left-2 bg-[#050714] px-2 text-[10px] text-blue-400 font-mono tracking-widest uppercase">
                                    Access Code (Password)
                                </label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full bg-transparent border border-blue-800/50 rounded p-4 text-white focus:border-blue-400 focus:shadow-[0_0_15px_rgba(59,130,246,0.3)] outline-none transition-all font-mono tracking-widest"
                                />
                                <p className="text-red-500 text-xs mt-1 font-mono">{errors.password}</p>
                            </div>

                            <div className="flex items-center justify-between text-xs font-mono text-gray-500">
                                <label className="flex items-center hover:text-white cursor-pointer transition">
                                    <input 
                                        type="checkbox" 
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="mr-2 accent-blue-600" 
                                    />
                                    KEEP SESSION ACTIVE
                                </label>
                                <Link href={route('register')} className="text-blue-400 hover:text-white transition uppercase decoration-blue-500/50 underline underline-offset-4">
                                    Create New ID
                                </Link>
                            </div>

                            <button 
                                disabled={processing}
                                className="w-full py-4 bg-gradient-to-r from-blue-900 to-blue-800 border border-blue-500/30 text-blue-100 font-bold font-mono tracking-[0.3em] uppercase rounded hover:from-blue-700 hover:to-blue-600 hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all duration-300"
                            >
                                {processing ? 'Verifying...' : 'Establish Connection'}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </CosmicLayout>
    );
}