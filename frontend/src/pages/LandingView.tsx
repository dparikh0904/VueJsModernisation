import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { Rocket, Zap, Shield, Code } from 'lucide-react';

export default function LandingView() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-default text-white py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Argon Design System
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            A beautiful React design system with JWT authentication.
            Build modern applications faster with production-ready components.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register">
              <Button variant="neutral" size="lg">
                Get Started
              </Button>
            </Link>
            <Link to="/components">
              <Button variant="outline-primary" size="lg" className="text-white border-white hover:bg-white hover:text-primary">
                View Components
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary-800 mb-4">
              Amazing Features
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Everything you need to build modern web applications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardBody className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Rocket className="text-primary" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Fast Development</h3>
                <p className="text-secondary-600">
                  Pre-built components and utilities to speed up your workflow
                </p>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="text-center">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="text-success" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">High Performance</h3>
                <p className="text-secondary-600">
                  Optimized for speed with React 18 and Vite
                </p>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="text-center">
                <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="text-warning" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Secure Auth</h3>
                <p className="text-secondary-600">
                  JWT authentication with HttpOnly cookies and CSRF protection
                </p>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="text-center">
                <div className="w-16 h-16 bg-info/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="text-info" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">TypeScript</h3>
                <p className="text-secondary-600">
                  Fully typed for better developer experience and fewer bugs
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-default text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Create your account today and start building amazing applications
          </p>
          <Link to="/register">
            <Button variant="neutral" size="lg">
              Create Free Account
            </Button>
          </Link>
          <p className="mt-6 text-white/80">
            Powered by{' '}
            <a
              href="https://appseed.us"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white"
            >
              AppSeed
            </a>
          </p>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 bg-secondary-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-secondary-800 mb-4">
              Modern Tech Stack
            </h2>
            <p className="text-xl text-secondary-600">
              Built with the latest technologies
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="font-bold text-lg">React 18</h3>
                <p className="text-sm text-secondary-600">UI Framework</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="font-bold text-lg">TypeScript</h3>
                <p className="text-sm text-secondary-600">Type Safety</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="font-bold text-lg">Tailwind CSS</h3>
                <p className="text-sm text-secondary-600">Styling</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="font-bold text-lg">Zustand</h3>
                <p className="text-sm text-secondary-600">State Management</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}