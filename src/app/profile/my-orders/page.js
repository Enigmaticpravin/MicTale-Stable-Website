'use client';

import { useState, useEffect } from 'react';
import { Metadata } from 'next';
import Footer from '@/app/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { HelpCircle } from 'lucide-react';

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!currentUser?.uid) return;
      
      try {
        const ticketsQuery = query(
          collection(db, 'tickets'),
          where('userId', '==', currentUser?.uid),
        );
        
        const ticketSnapshot = await getDocs(ticketsQuery);
        const ticketList = ticketSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setTickets(ticketList);
        
        const showIds = [...new Set(ticketList.map(ticket => ticket.showId))];
        await fetchShowDetails(showIds);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setLoading(false);
      }
    };
    
    fetchTickets();
  }, [currentUser?.uid]);

  const sendToPaymentGateway = async (ticket, show) => {
    const { id, bookingId, amount, productInfo, fullName, email, phoneNumber } = ticket;
    const response = await fetch('/api/payments/payu', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 200,
        productInfo: "Poetry Event Ticket",
        firstname: fullName,
        email: email,
        phone: phoneNumber,
        bookingId: bookingId,
      }),
    });
    const data = await response.json();

      if (data.action) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = data.action;
  
        Object.keys(data).forEach((key) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = data[key];
          form.appendChild(input);
        });
  
        document.body.appendChild(form);
        form.submit();
     
    }
  };
  
  const fetchShowDetails = async (showIds) => {
    try {
      const showData = {};
      
      for (const showId of showIds) {
        const showQuery = query(
          collection(db, 'shows'),
          where('showid', '==', showId)
        );
        
        const showSnapshot = await getDocs(showQuery);
        if (!showSnapshot.empty) {
          showData[showId] = showSnapshot.docs[0].data();
        }
      }
      
      setShowDetails(showData);
      console.log('Fetched show details:', showData);
    } catch (error) {
      console.error('Error fetching show details:', error);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };
  
  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'confirmed':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'pending':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'cancelled':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default:
        return 'bg-violet-500/20 text-violet-400 border-violet-500/30';
    }
  };
  
  const getStatusIcon = (status) => {
    switch(status.toLowerCase()) {
      case 'confirmed':
        return (
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'pending':
        return (
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'cancelled':
        return (
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M12 16V16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
    }
  };
  
  const formatCreatedDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    if (!date) return 'Time TBD';
    
    const eventDate = typeof date === 'string' ? new Date(date) : date;
    return eventDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    if (!date) return 'Date TBD';
    
    const eventDate = typeof date === 'string' ? new Date(date) : date;
    return eventDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredTickets = filterStatus === 'all' 
    ? tickets 
    : tickets.filter(ticket => ticket.paymentStatus?.toLowerCase() === filterStatus);

  if (loading) {
    return (
      <div className="bg-gray-950 text-gray-100 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 right-0 bottom-0 border-4 border-indigo-500/30 rounded-full"></div>
            <div className="absolute top-0 left-0 right-0 bottom-0 border-4 border-transparent border-t-indigo-500 animate-spin rounded-full"></div>
          </div>
          <p className="mt-4 text-indigo-300 font-medium">Loading your tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-gray-100">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] pointer-events-none"></div>
        
        <main className="max-w-5xl mx-auto py-4 md:py-12 px-4 sm:px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <h1 className="md:text-5xl text-transparent bg-clip-text bg-gradient-to-t font-bold text-[18px] from-yellow-700 via-yellow-500 to-yellow-900">
                My Tickets
              </h1>
              <p className="text-gray-400">
                Manage and view your upcoming poetry events
              </p>
            </div>
            
            <div className="flex space-x-2 w-fit bg-gray-800/50 p-1 rounded-lg backdrop-blur-sm border border-gray-700/50">
              <button 
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                  filterStatus === 'all' 
                    ? 'bg-yellow-600 text-white shadow-lg shadow-indigo-500/20' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                All
              </button>
              <button 
                onClick={() => setFilterStatus('confirmed')}
                className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                  filterStatus === 'confirmed' 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                Confirmed
              </button>
              <button 
                onClick={() => setFilterStatus('pending')}
                className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                  filterStatus === 'pending' 
                    ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/20' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                Pending
              </button>
            </div>
          </div>
          
          {tickets.length === 0 ? (
            <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-12 text-center border border-gray-700/50">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-700/50 flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 12V22H4V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 7H2V12H22V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 22V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 7H16.5C17.163 7 17.7989 6.73661 18.2678 6.26777C18.7366 5.79893 19 5.16304 19 4.5C19 3.83696 18.7366 3.20107 18.2678 2.73223C17.7989 2.26339 17.163 2 16.5 2C13 2 12 7 12 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 7H7.5C6.83696 7 6.20107 6.73661 5.73223 6.26777C5.26339 5.79893 5 5.16304 5 4.5C5 3.83696 5.26339 3.20107 5.73223 2.73223C6.20107 2.26339 6.83696 2 7.5 2C11 2 12 7 12 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">No tickets found</h2>
              <p className="text-gray-400 max-w-md mx-auto">Looks like you haven&apos;t purchased any tickets yet. Explore our upcoming events and secure your spot!</p>
           
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-8 text-center border border-gray-700/50">
              <h2 className="text-xl mb-2">No {filterStatus} tickets found</h2>
              <p className="text-gray-400">Try selecting a different filter option.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              <AnimatePresence>
                {filteredTickets.map((ticket) => {
                  const show = showDetails[ticket.showId] || {};
                  return (
                    <motion.div
                      key={ticket.id}
                      layout
                      className={`bg-gray-800/40 backdrop-blur-sm rounded-2xl overflow-hidden cursor-pointer border transition-all ${
                        expandedId === ticket.id 
                          ? 'border-indigo-500/30 shadow-lg shadow-indigo-900/20' 
                          : 'border-gray-700/50 hover:border-indigo-500/20'
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div 
                        onClick={() => toggleExpand(ticket.id)}
                        className="p-5 sm:p-6"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center space-x-4">
                            <div className="hidden sm:block w-14 h-14 rounded-xl bg-gray-700/50 overflow-hidden flex-shrink-0">
                              <img 
                                src={show.imageUrl} 
                                alt="" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h2 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                                {show.name || 'Poetry Event'}
                              </h2>
                              <div className="flex items-center mt-1 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="mr-3">{formatDate(show.date)}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{formatTime(show.date)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <div className={`px-3 py-1.5 rounded-full flex items-center text-sm border ${getStatusColor(ticket.paymentStatus)}`}>
                              {getStatusIcon(ticket.paymentStatus)}
                              {ticket.paymentStatus?.charAt(0).toUpperCase() + ticket.paymentStatus?.slice(1)}
                            </div>
                            <motion.div 
                              animate={{ rotate: expandedId === ticket.id ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700/70 text-indigo-300"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </motion.div>
                          </div>
                        </div>
                        
                        <AnimatePresence>
                          {expandedId === ticket.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.4 }}
                              className="mt-6 overflow-hidden"
                            >
                              <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                              >
                                <div className="relative w-full h-56 sm:h-64 rounded-xl overflow-hidden mb-6">
                                  <img 
                                    src={show.imageUrl} 
                                    alt={`${show.name || 'Event'} banner`} 
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-gray-900/0"></div>
                                  <div className="absolute bottom-0 left-0 p-6 w-full">
                                    <h3 className="text-2xl font-bold text-white mb-2">{show.name || 'Poetry Event'}</h3>
                                    <div className="flex flex-wrap gap-2">
                                      <span className="text-sm font-medium bg-gray-900/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {show.location || 'Venue TBD'}
                                      </span>
                                      <span className="text-sm font-medium bg-gray-900/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {formatTime(show.date)}
                                      </span>
                                      <span className="text-sm font-medium bg-gray-900/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {formatDate(show.date)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="space-y-6">
                                  {show.description && (
                                    <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-xl p-5">
                                      <p className="text-gray-300 leading-relaxed">{show.description}</p>
                                    </div>
                                  )}
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                    <div className="md:col-span-7">
                                      <div className="bg-gray-800/70 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden">
                                        <div className="p-5 border-b border-gray-700/50">
                                          <h3 className="font-semibold text-lg text-white">Ticket Details</h3>
                                        </div>
                                        <div className="divide-y divide-gray-700/50">
                                          <div className="flex justify-between p-4">
                                            <span className="text-gray-400">Booking ID</span>
                                            <span className="font-medium text-white">{ticket.bookingId}</span>
                                          </div>
                                          <div className="flex justify-between p-4">
                                            <span className="text-gray-400">Attendees</span>
                                            <span className="font-medium text-white">{ticket.attendeeCount}</span>
                                          </div>
                                          <div className="flex justify-between p-4">
                                            <span className="text-gray-400">Merchandise</span>
                                            <span className="font-medium text-white">{ticket.merchandiseOption ? 'Signed Book' : 'None'}</span>
                                          </div>
                                          <div className="flex justify-between p-4">
                                            <span className="text-gray-400">Date</span>
                                            <span className="font-medium text-white">{show.date ? new Date(show.date).toLocaleDateString() : 'TBD'}</span>
                                          </div>
                                          <div className="flex justify-between p-4">
                                            <span className="text-gray-400">Booked On</span>
                                            <span className="font-medium text-white">{formatCreatedDate(ticket.createdAt)}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="md:col-span-5">
                                      <div className="bg-gray-800/70 backdrop-blur-sm border border-gray-700/50 rounded-xl h-full">
                                        <div className="p-5 border-b border-gray-700/50">
                                          <h3 className="font-semibold text-lg text-white">Actions</h3>
                                        </div>
                                        <div className="p-6 flex flex-col items-center">
                                          <div className="relative">
                                            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg blur opacity-50"></div>
                                            
                                          </div>
                                          
                                          {ticket.paymentStatus === 'pending' ? (
                                            <button
                                              onClick={() => sendToPaymentGateway(ticket, show)}
                                              className="mt-6 w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-3 px-4 rounded-xl font-medium shadow-lg shadow-amber-900/30 transition-all flex justify-center items-center space-x-2">
                                              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M19 9L12 16L5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                              </svg>
                                              <span>Complete Payment</span>
                                            </button>
                                          ) : ticket.paymentStatus === 'confirmed' ? (
                                            <button className="mt-6 w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-3 px-4 rounded-xl font-medium shadow-lg shadow-indigo-900/30 transition-all flex justify-center items-center space-x-2">
                                              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M4 16V17C4 17.5304 4.21071 18.0391 4.58579 18.4142C4.96086 18.7893 5.46957 19 6 19H18C18.5304 19 19.0391 18.7893 19.4142 18.4142C19.7893 18.0391 20 17.5304 20 17V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M12 12V3M12 12L16 8M12 12L8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                              </svg>
                                              <span>Download Ticket</span>
                                            </button>
                                          ) : (
                                            <div className="mt-6 w-full bg-rose-900/30 border border-rose-500/30 text-rose-300 py-3 px-4 rounded-xl font-medium text-center flex justify-center items-center space-x-2">
                                              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                              </svg>
                                              <span>Ticket Cancelled</span>
                                            </div>
                                          )}
                                          
                                          {ticket.paymentStatus === 'confirmed' && (
                                            <button className="mt-4 w-full bg-gray-700/50 border border-gray-600/50 hover:bg-gray-700 text-white py-2.5 px-4 rounded-xl font-medium transition-all flex justify-center items-center space-x-2">
                                              <HelpCircle className="w-5 h-5" />
                                              <span>Need Help?</span>
                                      
                                            </button>
                                          )}
                                          
                                          <div className="mt-6 text-center">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full ${getStatusColor(ticket.paymentStatus)}`}>
                                              {getStatusIcon(ticket.paymentStatus)}
                                              {ticket.paymentStatus?.charAt(0).toUpperCase() + ticket.paymentStatus?.slice(1)}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </main>
      </div>
      <Footer />
      <style jsx>{`
        .ticket-card {
          transition: transform 0.3s ease;
        }
        .ticket-card:hover {
          transform: translateY(-4px);
        }
      `}</style>
    </>
  );
}