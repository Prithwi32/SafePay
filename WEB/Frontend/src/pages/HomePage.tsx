import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Mic, Users, AlertTriangle, ArrowRight, CheckCircle, Star } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                  SafePay – Smarter & Safer{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">
                    Digital Banking
                  </span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  Experience the future of banking with voice confirmation, elder-friendly design, and advanced fraud
                  protection. Your money, your security, our priority.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-cyan-600 hover:bg-cyan-700 text-white">
                  <Link to="/connect-bank">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/send-money">Send Money</Link>
                </Button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Bank-grade security</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>24/7 fraud monitoring</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Transfer</h3>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <span className="text-sm text-green-800 dark:text-green-300">✓ Voice confirmed</span>
                      <span className="text-sm font-medium text-green-800 dark:text-green-300">₹5,000</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <span className="text-sm text-blue-800 dark:text-blue-300">⚡ Instant transfer</span>
                      <span className="text-sm font-medium text-blue-800 dark:text-blue-300">₹2,500</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                      <span className="text-sm text-orange-800 dark:text-orange-300">🛡️ Fraud protected</span>
                      <span className="text-sm font-medium text-orange-800 dark:text-orange-300">₹75,000</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full opacity-20"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">Why Choose SafePay?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Built with cutting-edge security features and user-friendly design for everyone
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 border-transparent hover:border-cyan-200 dark:hover:border-cyan-800 transition-all duration-300 group">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-cyan-100 to-cyan-200 dark:from-cyan-900 dark:to-cyan-800 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Mic className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />
                </div>
                <CardTitle className="text-xl text-gray-900 dark:text-white">Voice Confirmation</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base leading-relaxed">
                  Every transaction is confirmed with your voice for maximum security. No more worrying about
                  unauthorized transfers.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 group">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-xl text-gray-900 dark:text-white">Elder-Friendly Mode</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base leading-relaxed">
                  Larger fonts, simplified interface, and enhanced accessibility features make banking comfortable for
                  all ages.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 border-transparent hover:border-red-200 dark:hover:border-red-800 transition-all duration-300 group">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900 dark:to-red-800 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle className="text-xl text-gray-900 dark:text-white">Fraud Alerts</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base leading-relaxed">
                  Advanced AI monitors your transactions 24/7, instantly alerting you to any suspicious activity or
                  potential fraud.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-800 dark:to-blue-800">
        <div className="container mx-auto px-4 text-center">
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">Ready to Experience Safer Banking?</h2>
            <p className="text-xl text-cyan-100 max-w-2xl mx-auto">
              Join thousands of users who trust SafePay for their digital banking needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="bg-white text-cyan-600 hover:bg-gray-100">
                <Link to="/connect-bank">
                  Connect Your Bank <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-cyan-600 bg-transparent"
              >
                <Link to="/send-money">Start Sending Money</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
