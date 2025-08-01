import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Smartphone, DollarSign } from 'lucide-react';
import Logo from './Logo';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose }) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [donationType, setDonationType] = useState<'one-time' | 'monthly'>('one-time');
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal' | 'mpesa'>('stripe');

  const predefinedAmounts = [25, 50, 100, 250, 500, 1000];

  const handleDonate = () => {
    const amount = selectedAmount || parseFloat(customAmount);
    if (amount > 0) {
      // Here you would integrate with actual payment processors
      alert(`Thank you for your ${donationType} donation of $${amount}!`);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                <Logo size="md" />
                <h2 className="text-2xl font-bold text-text-dark">Make a Donation</h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Donation Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-text-dark mb-2">
                Donation Type
              </label>
              <div className="flex space-x-4">
                <button
                  onClick={() => setDonationType('one-time')}
                  className={`flex-1 py-2 px-4 rounded-full border transition-colors ${
                    donationType === 'one-time'
                      ? 'bg-primary-light/10 border-primary text-primary'
                      : 'border-gray-300 text-text-dark hover:bg-gray-50'
                  }`}
                >
                  One-time
                </button>
                <button
                  onClick={() => setDonationType('monthly')}
                  className={`flex-1 py-2 px-4 rounded-full border transition-colors ${
                    donationType === 'monthly'
                      ? 'bg-primary-light/10 border-primary text-primary'
                      : 'border-gray-300 text-text-dark hover:bg-gray-50'
                  }`}
                >
                  Monthly
                </button>
              </div>
            </div>

            {/* Amount Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-text-dark mb-2">
                Select Amount
              </label>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {predefinedAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      setSelectedAmount(amount);
                      setCustomAmount('');
                    }}
                    className={`py-2 px-4 rounded-full border transition-colors ${
                      selectedAmount === amount
                        ? 'bg-primary-light/10 border-primary text-primary'
                        : 'border-gray-300 text-text-dark hover:bg-gray-50'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  placeholder="Custom amount"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(null);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-text-dark mb-2">
                Payment Method
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => setPaymentMethod('stripe')}
                  className={`w-full flex items-center space-x-3 p-3 rounded-full border transition-colors ${
                    paymentMethod === 'stripe'
                      ? 'bg-primary-light/10 border-primary'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <CreditCard className="h-5 w-5 text-primary" />
                  <span>Credit/Debit Card (Stripe)</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('paypal')}
                  className={`w-full flex items-center space-x-3 p-3 rounded-full border transition-colors ${
                    paymentMethod === 'paypal'
                      ? 'bg-primary-light/10 border-primary'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <CreditCard className="h-5 w-5 text-primary" />
                  <span>PayPal</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('mpesa')}
                  className={`w-full flex items-center space-x-3 p-3 rounded-full border transition-colors ${
                    paymentMethod === 'mpesa'
                      ? 'bg-primary-light/10 border-primary'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Smartphone className="h-5 w-5 text-accent" />
                  <span>M-Pesa</span>
                </button>
              </div>
            </div>

            {/* Donate Button */}
            <button
              onClick={handleDonate}
              disabled={!selectedAmount && !customAmount}
              className="w-full bg-accent hover:bg-accent-dark text-text-dark py-3 px-6 rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
            >
              Donate {donationType === 'monthly' ? 'Monthly' : 'Now'}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Your donation is secure and will be processed safely. Thank you for your generosity!
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DonationModal;