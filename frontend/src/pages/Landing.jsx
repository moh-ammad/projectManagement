import { Link } from 'react-router-dom';
import {
    BarChart3,
    Users,
    FolderOpen,
    Shield,
    Activity,
    CheckCircle,
    ArrowRight,
    Star,
    Zap
} from 'lucide-react';

const Landing = () => {
    const features = [
        {
            icon: <Users className="h-8 w-8 text-blue-500" />,
            title: "Employee Roles",
            description: "Secure access based on your position - Admin, Manager, or Team Member"
        },
        {
            icon: <FolderOpen className="h-8 w-8 text-green-500" />,
            title: "Project Tracking",
            description: "View your assigned projects, update status, and collaborate with teammates"
        },
        {
            icon: <Activity className="h-8 w-8 text-purple-500" />,
            title: "Work History",
            description: "Track your contributions and see team activity across all projects"
        },
        {
            icon: <BarChart3 className="h-8 w-8 text-orange-500" />,
            title: "Personal Dashboard",
            description: "Your personalized workspace with relevant metrics and updates"
        },
        {
            icon: <Shield className="h-8 w-8 text-red-500" />,
            title: "Company Security",
            description: "Protected access to Digital Bevy's internal project data"
        },
        {
            icon: <Zap className="h-8 w-8 text-yellow-500" />,
            title: "Instant Updates",
            description: "Real-time notifications when projects are assigned or updated"
        }
    ];

    const testimonials = [
        {
            name: "Mahesh",
            role: "Project Manager",
            content: "This employee portal has streamlined our project workflows at Digital Bevy. The role-based access keeps everything organized!",
            rating: 5
        },
        {
            name: "Sohel",
            role: "Team Lead",
            content: "Love how I can track my team's progress and manage assignments all in one place. Makes my job so much easier!",
            rating: 5
        },
        {
            name: "Surya",
            role: "Senior Developer",
            content: "Simple, secure, and efficient. Perfect for managing our daily tasks and collaborating with colleagues.",
            rating: 5
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-100/20 via-transparent to-secondary-100/20"></div>

            {/* Header */}
            <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <img
                                src="/logo.png"
                                alt="Digital Bevy"
                                className="h-8 w-8 mr-3 rounded-full object-contain"
                            />
                            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                                Digital Bevy
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/login"
                                className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="btn btn-primary"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative py-24 lg:py-40 overflow-hidden">
                {/* Hero Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center">


                        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-5 leading-tight">
                                Welcome to{' '}
                                <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-600 bg-clip-text text-transparent">
                                    Digital Bevy
                                </span>
                            </h1>
                        </div>

                        <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                                Employee Portal for <span className="font-semibold text-primary-700">Digital Bevy Pvt Ltd</span> - Manage your projects, track progress,
                                and collaborate with your team members efficiently.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
                            <Link
                                to="/login"
                                className="group relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 inline-flex items-center justify-center"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                                <span className="relative flex items-center">
                                    Employee Login
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                                </span>
                            </Link>
                            <Link
                                to="/register"
                                className="group relative overflow-hidden bg-white text-primary-700 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl border-2 border-primary-200 hover:border-primary-300 transform hover:-translate-y-1 transition-all duration-300"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-primary-50 to-secondary-50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                                <span className="relative">New Employee Setup</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-20 left-10 animate-bounce">
                    <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-full p-3 shadow-lg">
                        <Users className="h-6 w-6 text-white" />
                    </div>
                </div>
                <div className="absolute top-32 right-10 animate-bounce" style={{ animationDelay: '1s' }}>
                    <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full p-3 shadow-lg">
                        <FolderOpen className="h-6 w-6 text-white" />
                    </div>
                </div>
                <div className="absolute bottom-20 left-20 animate-bounce" style={{ animationDelay: '2s' }}>
                    <div className="bg-gradient-to-br from-accent-600 to-accent-700 rounded-full p-3 shadow-lg">
                        <Activity className="h-6 w-6 text-white" />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-gradient-to-b from-white to-gray-50 relative">
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl mb-6 shadow-lg">
                            <Star className="h-8 w-8 text-white" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Employee-Focused Features
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Everything Digital Bevy employees need to manage projects and collaborate effectively
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group relative bg-white rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary-200 transform hover:-translate-y-2"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-secondary-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative">
                                    <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-700 transition-colors duration-300">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Role-based Access Section */}
            <section className="py-20 bg-gradient-to-r from-primary-50 to-purple-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Employee Role Management
                        </h2>
                        <p className="text-xl text-gray-600">
                            Secure access levels designed for Digital Bevy's organizational structure
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-xl p-8 shadow-lg text-center">
                            <div className="bg-yellow-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                                <Shield className="h-8 w-8 text-yellow-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Admin</h3>
                            <ul className="text-gray-600 space-y-2">
                                <li className="flex items-center justify-center">
                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                    Full system access
                                </li>
                                <li className="flex items-center justify-center">
                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                    User management
                                </li>
                                <li className="flex items-center justify-center">
                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                    All project control
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-xl p-8 shadow-lg text-center">
                            <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                                <Users className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Manager</h3>
                            <ul className="text-gray-600 space-y-2">
                                <li className="flex items-center justify-center">
                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                    Team management
                                </li>
                                <li className="flex items-center justify-center">
                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                    Project creation
                                </li>
                                <li className="flex items-center justify-center">
                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                    Team analytics
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-xl p-8 shadow-lg text-center">
                            <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                                <FolderOpen className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">User</h3>
                            <ul className="text-gray-600 space-y-2">
                                <li className="flex items-center justify-center">
                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                    View assigned projects
                                </li>
                                <li className="flex items-center justify-center">
                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                    Update status
                                </li>
                                <li className="flex items-center justify-center">
                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                    Personal dashboard
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-10 right-10 w-64 h-64 bg-primary-100/30 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 left-10 w-80 h-80 bg-secondary-100/30 rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-2xl mb-6 shadow-lg">
                            <Users className="h-8 w-8 text-white" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Trusted by Digital Bevy Employees
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            See what our team members have to say about the employee portal
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary-200 transform hover:-translate-y-2"
                                style={{ animationDelay: `${index * 0.2}s` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 to-secondary-50/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative">
                                    <div className="flex mb-6">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                                        ))}
                                    </div>
                                    <blockquote className="text-gray-700 mb-6 text-lg leading-relaxed italic">
                                        "{testimonial.content}"
                                    </blockquote>
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                                            {testimonial.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-lg">{testimonial.name}</p>
                                            <p className="text-primary-600 font-medium">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-800/20 to-secondary-800/20"></div>
                    <div className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 left-10 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative">
                    <div className="animate-fade-in">
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                            Ready to Access Your
                            <span className="block bg-gradient-to-r from-white to-primary-100 bg-clip-text text-transparent">
                                Employee Portal?
                            </span>
                        </h2>
                        <p className="text-xl md:text-2xl text-primary-100 mb-12 max-w-3xl mx-auto leading-relaxed">
                            Join your Digital Bevy colleagues in managing projects efficiently and collaboratively
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Link
                                to="/login"
                                className="group relative overflow-hidden bg-white text-primary-700 font-bold py-5 px-10 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 inline-flex items-center justify-center"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-primary-50 to-secondary-50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                                <span className="relative flex items-center text-lg">
                                    Employee Login
                                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                                </span>
                            </Link>
                            <Link
                                to="/register"
                                className="group relative overflow-hidden border-2 border-white/30 text-white hover:border-white font-bold py-5 px-10 rounded-2xl backdrop-blur-sm hover:bg-white/10 transform hover:-translate-y-1 transition-all duration-300"
                            >
                                <span className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                                <span className="relative text-lg">New Employee Setup</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center mb-4 md:mb-0">
                            <img
                                src="/logo.png"
                                alt="Digital Bevy"
                                className="h-8 w-8 mr-3 rounded-full object-contain"
                            />
                            <span className="text-2xl font-bold text-white">Digital Bevy</span>
                        </div>
                        <div className="text-gray-400">
                            <p>&copy; 2024 Digital Bevy Pvt Ltd. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;