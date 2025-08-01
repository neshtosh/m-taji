import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CreditCard, 
  Smartphone, 
  DollarSign, 
  Heart,
  MapPin,
  Calendar,
  Users,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Donation, Project, DonationFormData } from '../../types';
import Logo from './Logo';

interface EnhancedDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects?: Project[];
  selectedProjectId?: string;
}

const EnhancedDonationModal: React.FC<EnhancedDonationModalProps> = ({ 
  isOpen, 
  onClose, 
  projects = [],
  selectedProjectId 
}) => {
  const [step, setStep] = useState<'amount' | 'details' | 'payment' | 'confirmation'>('amount');
  const [formData, setFormData] = useState<DonationFormData>({
    amount: 0,
    type: 'general',
    projectId: selectedProjectId,
    donorName: '',
    donorEmail: '',
    donorPhone: '',
    paymentMethod: 'stripe',
    message: '',
    isAnonymous: false
  });
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const predefinedAmounts = [25, 50, 100, 250, 500, 1000];

  const selectedProject = projects.find(p => p.id === formData.projectId);

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    setFormData(prev => ({ ...prev, amount }));
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
    setFormData(prev => ({ ...prev, amount: parseFloat(value) || 0 }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleNext = () => {
    if (step === 'amount' && formData.amount <= 0) {
      setError('Please select a valid amount');
      return;
    }
    if (step === 'details' && !formData.donorName && !formData.isAnonymous) {
      setError('Please enter your name or select anonymous donation');
      return;
    }
    if (step === 'details' && !formData.donorEmail) {
      setError('Please enter your email address');
      return;
    }

    setError('');
    if (step === 'amount') setStep('details');
    else if (step === 'details') setStep('payment');
    else if (step === 'payment') handlePayment();
  };

  const handleBack = () => {
    if (step === 'details') setStep('amount');
    else if (step === 'payment') setStep('details');
    else if (step === 'confirmation') setStep('payment');
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setError('');

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success
      setStep('confirmation');
    } catch (err) {
      setError('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setStep('amount');
    setFormData({
      amount: 0,
      type: 'general',
      projectId: selectedProjectId,
      donorName: '',
      donorEmail: '',
      donorPhone: '',
      paymentMethod: 'stripe',
      message: '',
      isAnonymous: false
    });
    setSelectedAmount(null);
    setCustomAmount('');
    setError('');
    onClose();
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'stripe':
        return <CreditCard className="h-5 w-5" />;
      case 'paypal':
        return <CreditCard className="h-5 w-5" />;
      case 'mpesa':
        return <Smartphone className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'stripe':
        return 'Credit/Debit Card';
      case 'paypal':
        return 'PayPal';
      case 'mpesa':
        return 'M-Pesa';
      default:
        return 'Credit Card';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <Logo size="md" />
                  <div>
                    <h2 className="text-xl font-bold text-text-dark">Make a Donation</h2>
                    <p className="text-sm text-gray-600">
                      {selectedProject ? `Supporting: ${selectedProject.title}` : 'General Fund'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center justify-between mt-6">
                {['amount', 'details', 'payment', 'confirmation'].map((stepName, index) => (
                  <div key={stepName} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step === stepName 
                        ? 'bg-primary text-white' 
                        : index < ['amount', 'details', 'payment', 'confirmation'].indexOf(step)
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {index < ['amount', 'details', 'payment', 'confirmation'].indexOf(step) ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    {index < 3 && (
                      <div className={`w-12 h-1 mx-2 ${
                        index < ['amount', 'details', 'payment', 'confirmation'].indexOf(step)
                        ? 'bg-green-200'
                        : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center space-x-2"
                >
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Step 1: Amount Selection */}
              {step === 'amount' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {selectedProject && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-text-dark mb-2">{selectedProject.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{selectedProject.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{selectedProject.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${selectedProject.progress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-gray-600">
                          ${selectedProject.raisedAmount.toLocaleString()} raised
                        </span>
                        <span className="text-gray-600">
                          of ${selectedProject.targetAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-semibold text-text-dark mb-4">Select Amount</h3>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {predefinedAmounts.map((amount) => (
                        <button
                          key={amount}
                          onClick={() => handleAmountSelect(amount)}
                          className={`p-3 rounded-lg border-2 transition-colors ${
                            selectedAmount === amount
                              ? 'border-primary bg-primary-light/10 text-primary'
                              : 'border-gray-200 hover:border-primary'
                          }`}
                        >
                          <div className="text-lg font-bold">${amount}</div>
                        </button>
                      ))}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-dark mb-2">
                        Custom Amount
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="number"
                          value={customAmount}
                          onChange={(e) => handleCustomAmountChange(e.target.value)}
                          placeholder="Enter amount"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Donor Details */}
              {step === 'details' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-text-dark mb-4">Donor Information</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="anonymous"
                          name="isAnonymous"
                          checked={formData.isAnonymous}
                          onChange={handleInputChange}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor="anonymous" className="text-sm text-gray-700">
                          Make this donation anonymous
                        </label>
                      </div>

                      {!formData.isAnonymous && (
                        <div>
                          <label className="block text-sm font-medium text-text-dark mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="donorName"
                            value={formData.donorName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Your full name"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="donorEmail"
                          value={formData.donorEmail}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="your.email@example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-2">
                          Phone Number (Optional)
                        </label>
                        <input
                          type="tel"
                          name="donorPhone"
                          value={formData.donorPhone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="+1234567890"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-2">
                          Message (Optional)
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Share why you're making this donation..."
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Payment Method */}
              {step === 'payment' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-text-dark mb-4">Payment Method</h3>
                    
                    <div className="space-y-3">
                      {[
                        { value: 'stripe', label: 'Credit/Debit Card', icon: CreditCard },
                        { value: 'paypal', label: 'PayPal', icon: CreditCard },
                        { value: 'mpesa', label: 'M-Pesa', icon: Smartphone }
                      ].map((method) => (
                        <button
                          key={method.value}
                          onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.value as any }))}
                          className={`w-full p-4 border-2 rounded-lg transition-colors ${
                            formData.paymentMethod === method.value
                              ? 'border-primary bg-primary-light/10'
                              : 'border-gray-200 hover:border-primary'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <method.icon className="h-5 w-5 text-gray-600" />
                            <span className="font-medium text-text-dark">{method.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-text-dark mb-2">Donation Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Amount:</span>
                          <span className="font-medium">${formData.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Type:</span>
                          <span className="font-medium">
                            {selectedProject ? 'Project Specific' : 'General Fund'}
                          </span>
                        </div>
                        {selectedProject && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Project:</span>
                            <span className="font-medium">{selectedProject.title}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment:</span>
                          <span className="font-medium">{getPaymentMethodLabel(formData.paymentMethod)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Confirmation */}
              {step === 'confirmation' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-center space-y-6"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-text-dark mb-2">Thank You!</h3>
                    <p className="text-gray-600">
                      Your donation of ${formData.amount.toLocaleString()} has been successfully processed.
                    </p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-800">
                      You will receive a confirmation email shortly. Thank you for your generosity!
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            {step !== 'confirmation' && (
              <div className="p-6 border-t border-gray-200">
                <div className="flex justify-between">
                  {step !== 'amount' && (
                    <button
                      onClick={handleBack}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Back
                    </button>
                  )}
                  <button
                    onClick={handleNext}
                    disabled={isProcessing}
                    className="ml-auto bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>{step === 'payment' ? 'Complete Donation' : 'Continue'}</span>
                    )}
                  </button>
                </div>
              </div>
            )}

            {step === 'confirmation' && (
              <div className="p-6 border-t border-gray-200">
                <button
                  onClick={handleClose}
                  className="w-full bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EnhancedDonationModal; 