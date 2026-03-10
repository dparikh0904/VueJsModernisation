import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Search, Star, Heart, Zap } from 'lucide-react';

export default function ComponentsView() {
  return (
    <div className="min-h-screen bg-secondary-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-secondary-800 mb-4">
            Component Showcase
          </h1>
          <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
            Explore our collection of beautiful, reusable components
          </p>
        </div>

        {/* Buttons Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-secondary-800 mb-8">Buttons</h2>
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold">Button Variants</h3>
            </CardHeader>
            <CardBody>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="neutral">Neutral</Button>
                <Button variant="outline-primary">Outline</Button>
                <Button variant="success">Success</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="warning">Warning</Button>
                <Button variant="info">Info</Button>
              </div>

              <div className="mt-8">
                <h4 className="font-semibold mb-4">Button Sizes</h4>
                <div className="flex flex-wrap gap-4 items-center">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="font-semibold mb-4">Buttons with Icons</h4>
                <div className="flex flex-wrap gap-4">
                  <Button leftIcon={<Star size={16} />}>
                    Left Icon
                  </Button>
                  <Button rightIcon={<Heart size={16} />}>
                    Right Icon
                  </Button>
                  <Button leftIcon={<Zap size={16} />} rightIcon={<Star size={16} />}>
                    Both Icons
                  </Button>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="font-semibold mb-4">Button States</h4>
                <div className="flex flex-wrap gap-4">
                  <Button isLoading>Loading</Button>
                  <Button disabled>Disabled</Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </section>

        {/* Inputs Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-secondary-800 mb-8">Form Inputs</h2>
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold">Input Fields</h3>
            </CardHeader>
            <CardBody className="space-y-6">
              <Input
                label="Basic Input"
                placeholder="Enter text..."
              />
              
              <Input
                label="Input with Icon"
                placeholder="Search..."
                leftIcon={<Search size={20} />}
              />
              
              <Input
                label="Email Input"
                type="email"
                placeholder="your@email.com"
              />
              
              <Input
                label="Password Input"
                type="password"
                placeholder="••••••••"
              />
              
              <Input
                label="Input with Error"
                placeholder="Invalid input"
                error="This field is required"
              />
            </CardBody>
          </Card>
        </section>

        {/* Cards Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-secondary-800 mb-8">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Simple Card</h3>
              </CardHeader>
              <CardBody>
                <p className="text-secondary-600">
                  This is a simple card with header and body.
                </p>
              </CardBody>
            </Card>

            <Card>
              <CardHeader className="bg-primary text-white">
                <h3 className="text-lg font-semibold">Colored Header</h3>
              </CardHeader>
              <CardBody>
                <p className="text-secondary-600">
                  Card with a colored header background.
                </p>
              </CardBody>
            </Card>

            <Card shadow={false}>
              <CardBody>
                <h3 className="text-lg font-semibold mb-2">No Shadow</h3>
                <p className="text-secondary-600">
                  Card without shadow effect.
                </p>
              </CardBody>
            </Card>
          </div>
        </section>

        {/* Colors Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-secondary-800 mb-8">Color Palette</h2>
          <Card>
            <CardBody>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="w-full h-24 bg-primary rounded-lg mb-2"></div>
                  <p className="font-semibold">Primary</p>
                  <p className="text-sm text-secondary-600">#5e72e4</p>
                </div>
                <div>
                  <div className="w-full h-24 bg-success rounded-lg mb-2"></div>
                  <p className="font-semibold">Success</p>
                  <p className="text-sm text-secondary-600">#2dce89</p>
                </div>
                <div>
                  <div className="w-full h-24 bg-danger rounded-lg mb-2"></div>
                  <p className="font-semibold">Danger</p>
                  <p className="text-sm text-secondary-600">#f5365c</p>
                </div>
                <div>
                  <div className="w-full h-24 bg-warning rounded-lg mb-2"></div>
                  <p className="font-semibold">Warning</p>
                  <p className="text-sm text-secondary-600">#fb6340</p>
                </div>
                <div>
                  <div className="w-full h-24 bg-info rounded-lg mb-2"></div>
                  <p className="font-semibold">Info</p>
                  <p className="text-sm text-secondary-600">#11cdef</p>
                </div>
                <div>
                  <div className="w-full h-24 bg-dark rounded-lg mb-2"></div>
                  <p className="font-semibold">Dark</p>
                  <p className="text-sm text-secondary-600">#172b4d</p>
                </div>
                <div>
                  <div className="w-full h-24 bg-secondary rounded-lg mb-2"></div>
                  <p className="font-semibold">Secondary</p>
                  <p className="text-sm text-secondary-600">#f4f5f7</p>
                </div>
                <div>
                  <div className="w-full h-24 bg-white border-2 border-secondary-300 rounded-lg mb-2"></div>
                  <p className="font-semibold">White</p>
                  <p className="text-sm text-secondary-600">#ffffff</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </section>

        {/* Typography Section */}
        <section>
          <h2 className="text-3xl font-bold text-secondary-800 mb-8">Typography</h2>
          <Card>
            <CardBody className="space-y-4">
              <h1 className="text-5xl font-bold">Heading 1</h1>
              <h2 className="text-4xl font-bold">Heading 2</h2>
              <h3 className="text-3xl font-bold">Heading 3</h3>
              <h4 className="text-2xl font-bold">Heading 4</h4>
              <h5 className="text-xl font-bold">Heading 5</h5>
              <h6 className="text-lg font-bold">Heading 6</h6>
              <p className="text-base">
                Regular paragraph text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
              <p className="text-sm text-secondary-600">
                Small text in secondary color for additional information.
              </p>
            </CardBody>
          </Card>
        </section>
      </div>
    </div>
  );
}